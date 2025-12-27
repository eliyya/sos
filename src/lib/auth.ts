import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin, customSession, username } from 'better-auth/plugins'
import { APP_NAME } from '../constants/client.ts'
import { db } from '../prisma/db.ts'

export const auth = betterAuth({
    trustedOrigins: ['https://dev.eliyya.dev'],
    database: prismaAdapter(db, {
        provider: 'postgresql',
    }),
    plugins: [
        username({
            schema: {
                user: {
                    fields: {
                        displayUsername: 'display_username',
                    },
                },
            },
            minUsernameLength: 3,
        }),
        admin(),
        customSession(async ({ session, user }) => {
            const perm = await db.role.findUnique({
                // @ts-expect-error role_id is a string
                where: { id: user.role_id },
            })
            const dbuser = await db.user.findUnique({
                where: { id: user.id },
            })
            return {
                ...session,
                user: {
                    ...user,
                    permissions: (perm?.permissions ?? 0n).toString(),
                    username: dbuser!.username,
                },
            }
        }),
        nextCookies(),
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    emailVerification: {
        sendOnSignUp: false,
    },
    session: {
        cookieCache: {
            enabled: true,
        },
        fields: {
            createdAt: 'created_at',
            expiresAt: 'expires_at',
            ipAddress: 'ip_address',
            userAgent: 'user_agent',
            id: 'id',
            updatedAt: 'updated_at',
            userId: 'user_id',
        },
    },
    user: {
        fields: {
            createdAt: 'created_at',
            emailVerified: 'email_verified',
            updatedAt: 'updated_at',
        },
        additionalFields: {
            role_id: {
                type: 'string',
                input: true,
            },
            // Only for session
            permissions: {
                type: 'string',
                input: false,
            },
        },
    },
    account: {
        fields: {
            createdAt: 'created_at',
            id: 'id',
            providerId: 'provider_id',
            providerType: 'provider_type',
            updatedAt: 'updated_at',
            userId: 'user_id',
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
            idToken: 'id_token',
            accessTokenExpiresAt: 'access_token_expires_at',
            refreshTokenExpiresAt: 'refresh_token_expires_at',
            scope: 'scope',
            password: 'password',
            accountId: 'account_id',
        },
    },
    verification: {
        fields: {
            createdAt: 'created_at',
            id: 'id',
            identifier: 'identifier',
            value: 'value',
            expiresAt: 'expires_at',
            updatedAt: 'updated_at',
        },
    },
    advanced: {
        cookiePrefix: APP_NAME,
        database: {
            generateId: false,
        },
    },
})
