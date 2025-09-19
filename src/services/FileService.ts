import { Effect } from 'effect'
import { PrismaService } from '../prisma/db'
import {
    InvalidInputError,
    AlreadyArchivedError,
    AlreadyExistsError,
    UnexpectedError,
} from '../errors'

export const insertFile = (name: string) =>
    Effect.gen(function* (_) {
        // 1. Validar input
        if (!name || name.trim().length < 3) {
            return yield* _(
                Effect.fail(new InvalidInputError('Nombre inválido')),
            )
        }

        const prisma = yield* _(PrismaService)

        // 2. Buscar archivo existente como efecto
        const existing = yield* _(
            Effect.tryPromise({
                try: () => prisma.user.findFirst({ where: { name } }),
                catch: err => new UnexpectedError(err),
            }),
        )

        // 3. Manejo de distintos escenarios
        if (existing) {
            if (existing.status === 'ARCHIVED') {
                return yield* _(
                    Effect.fail(new AlreadyArchivedError(existing.id)),
                )
            } else {
                return yield* _(
                    Effect.fail(new AlreadyExistsError(existing.id)),
                )
            }
        }

        // 4. Insertar nuevo archivo
        const created = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.role.create({ data: { name, permissions: 0n } }),
                catch: err => new UnexpectedError(err),
            }),
        )

        return created
    })
