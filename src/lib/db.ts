import { Prisma, PrismaClient } from '@prisma/client'
import { SnowFlakeGenerator } from './SnowFlake.ts'
import { compare } from 'bcrypt'
import { RoleFlags } from '../bitfields/RoleBitField.ts'
import { totp as stotp } from 'speakeasy'
import { ALGORITHM } from './constants.ts'
import { createDecipheriv } from 'node:crypto'
import { ENCRYPTION_KEY } from '../env/server.ts'

function createPrismaClient() {
    return new PrismaClient().$extends({
        name: 'validatePassword',
        model: {
            user: {
                async validateRootPassword(password: string, token: string) {
                    const root = await Prisma.getExtensionContext(
                        this,
                    ).findFirst({
                        where: {
                            role: RoleFlags.Manager,
                        },
                        select: {
                            username: true,
                            id: true,
                        },
                    })
                    if (
                        (await this.validatePassword(root!.email, password)) &&
                        (await this.validateTOTP(root!.id, token))
                    )
                        return true
                    return false
                },
                async validatePassword(username: string, password: string) {
                    const user = await Prisma.getExtensionContext(
                        this,
                    ).findFirst({
                        where: { username },
                        select: {
                            active: true,
                            auth: {
                                select: {
                                    password: true,
                                },
                            },
                        },
                    })
                    if (!user?.active || !user.auth) return false
                    return await compare(password, user.auth.password)
                },
                async hasTOTP(id: string) {
                    const user = await Prisma.getExtensionContext(
                        this,
                    ).findFirst({
                        where: { id },
                        select: {
                            auth: {
                                select: {
                                    totp: true,
                                },
                            },
                        },
                    })
                    return !!user?.auth?.totp
                },
                async validateTOTP(id: string, token: string) {
                    const user = await Prisma.getExtensionContext(
                        this,
                    ).$parent.auth.findFirst({
                        where: {
                            employee_id: id,
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
