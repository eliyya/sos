'use server'

import {
    BetterAuthAPIError,
    BetterError,
    InvalidCredentialsError,
    PrismaError,
} from '@/errors'
import { AuthLive } from '@/layers/auth.layer'
import { PrismaLive } from '@/layers/db.layer'
import { loginEffect } from '@/services/auth.service'
import { Effect } from 'effect'

export async function loginAction({
    password,
    username,
}: {
    username: string
    password: string
}) {
    return Effect.runPromise(
        Effect.scoped(
            loginEffect({ username, password })
                .pipe(Effect.provide(AuthLive))
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return {
                                status: 'success' as const,
                                data: value,
                            } as const
                        },
                        onFailure(error) {
                            if (error instanceof BetterError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                } as const
                            }
                            if (error instanceof InvalidCredentialsError) {
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-credentials' as const,
                                    message: error.message,
                                } as const
                            }
                            if (error instanceof BetterAuthAPIError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    cause: error.cause.message,
                                } as const
                            }
                            if (error instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                } as const
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(error),
                            } as const
                        },
                    }),
                ),
        ),
    )
}
