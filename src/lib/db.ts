import { Prisma, PrismaClient, STATUS } from '@prisma/client'
import { SnowFlakeGenerator } from './SnowFlake.ts'
import { compare } from 'bcrypt'
import { totp as stotp } from 'speakeasy'
import { ALGORITHM } from './constants.ts'
import { createDecipheriv } from 'node:crypto'
import { ENCRYPTION_KEY } from '../env/server.ts'

function createPrismaClient() {
    return new PrismaClient().$extends({
        name: 'validatePassword',
        model: {
            user: {
                async validatePassword(username: string, password: string) {
                    const user = await Prisma.getExtensionContext(
                        this,
                    ).findFirst({
                        where: { username, status: STATUS.ACTIVE },
                        select: {
                            auths: {
                                select: {
                                    password: true,
                                },
                            },
                        },
                    })
                    if (!user?.auths?.length) return false
                    return await compare(password, user.auths[0].password)
                },
                async hasTOTP(id: string) {
                    const user = await Prisma.getExtensionContext(
                        this,
                    ).findFirst({
                        where: { id },
                        select: {
                            auths: {
                                select: {
                                    totp: true,
                                },
                            },
                        },
                    })
                    return !!user?.auths[0]?.totp
                },
                async validateTOTP(id: string, token: string) {
                    const user = await Prisma.getExtensionContext(
                        this,
                    ).$parent.auth.findFirst({
                        where: {
                            user_id: id,
                        },
                        select: {
                            totp: true,
                        },
                    })
                    if (!user) return false
                    if (!user.totp) return true
                    // desencriptar el totp
                    const [ivHex, encryptedData] = user.totp.split(':')
                    const decipher = createDecipheriv(
                        ALGORITHM,
                        Buffer.from(ENCRYPTION_KEY, 'hex'),
                        Buffer.from(ivHex, 'hex'),
                    )
                    const secret =
                        decipher.update(encryptedData, 'hex', 'utf8') +
                        decipher.final('utf8')

                    return stotp.verify({
                        secret,
                        encoding: 'base32',
                        token,
                        window: 5, // margen permitido 1=30s
                    })
                },
            },
        },
    })
}

declare const globalThis: {
    dbGlobal: ReturnType<typeof createPrismaClient>
    snowflake: SnowFlakeGenerator
} & typeof global

const db = globalThis.dbGlobal ?? createPrismaClient()
const snowflake = globalThis.snowflake ?? new SnowFlakeGenerator()

if (process.env.NODE_ENV !== 'production') {
    globalThis.dbGlobal = db
    globalThis.snowflake = snowflake
}

export { db, snowflake }
