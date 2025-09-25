import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { PermissionError, UnauthorizedError, UnexpectedError } from '@/errors'
import { AuthService } from '@/layers/auth.layer'
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
