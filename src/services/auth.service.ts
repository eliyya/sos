import {
    PERMISSIONS_FLAGS,
    PermissionsBitField,
} from '@/bitfields/PermissionsBitField'
import {
    BetterAuthAPIError,
    BetterError,
    InvalidCredentialsError,
    PermissionError,
    PrismaError,
    UnauthorizedError,
    UnexpectedError,
} from '@/errors'
import { AuthService } from '@/layers/auth.layer'
import { PrismaService } from '@/layers/db.layer'
import { APIError } from 'better-auth'
import { Effect } from 'effect'

export const requirePermission = (
    flag: Parameters<PermissionsBitField['has']>[0],
) =>
    Effect.gen(function* (_) {
        const auth = yield* _(AuthService)

        const session = yield* _(
            Effect.tryPromise({
                try: () => auth.getSession(),
                catch: error => new UnexpectedError(error),
            }),
        )

        if (!session) {
            return yield* _(
                Effect.fail(new UnauthorizedError('Session required')),
            )
        }

        const permissions = new PermissionsBitField(session.user.permissions)

        if (!permissions.has(flag)) {
            return yield* _(Effect.fail(new PermissionError(flag)))
        }

        return session
    })

export function loginEffect({
    username,
    password,
}: {
    username: string
    password: string
}) {
    return Effect.gen(function* (_) {
        const auth = yield* _(AuthService)
        const prisma = yield* _(PrismaService)

        const user = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.findFirst({
                        where: { username },
                        select: {
                            permissions_role: {
                                select: { permissions: true },
                            },
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        if (user) {
            const permissions = new PermissionsBitField(
                user.permissions_role.permissions,
            )
            if (!permissions.has(PERMISSIONS_FLAGS.CAN_LOGIN)) {
                yield* _(
                    Effect.fail(
                        new InvalidCredentialsError({
                            message: 'Invalid username or password',
                        }),
                    ),
                )
            }
        }
        yield* _(
            Effect.tryPromise({
                try: () =>
                    auth.api.signInUsername({
                        body: { username, password },
                    }),
                catch: err => {
                    if (err instanceof APIError) {
                        if (err.body?.code === 'INVALID_USERNAME_OR_PASSWORD')
                            return new InvalidCredentialsError({
                                message: 'Invalid username or password',
                            })
                        return new BetterAuthAPIError({
                            cause: {
                                code: err.body?.code ?? 'UNKNOWN_ERROR',
                                message: err.body?.message ?? err.message,
                                status: err.status,
                            },
                        })
                    } else {
                        return new BetterError({ cause: err })
                    }
                },
            }),
        )
    })
}
