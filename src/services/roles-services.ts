import { Effect } from 'effect'

import {
    InvalidInputError,
    AlreadyExistsError,
    UnexpectedError,
    NotFoundError,
} from '../errors'
import { PrismaService } from '../prisma/db'

import { DEFAULT_ROLES } from '@/constants/client'

export const editRoleNameEffect = (id: string, name: string) =>
    Effect.gen(function* (_) {
        // 1. Validar input
        if (!name) {
            return yield* _(Effect.fail(new InvalidInputError('Required Name')))
        }
        if (
            Object.values(DEFAULT_ROLES)
                .map(r => r.toLowerCase())
                .includes(name.toLowerCase())
        ) {
            return yield* _(Effect.fail(new InvalidInputError('Reserved Name')))
        }
        if (!id) {
            return yield* _(Effect.fail(new InvalidInputError('Required ID')))
        }

        const prisma = yield* _(PrismaService)

        const actual = yield* _(
            Effect.tryPromise({
                try: () => prisma.role.findUnique({ where: { id } }),
                catch: err => new UnexpectedError(err),
            }),
        )

        if (!actual) {
            return yield* _(Effect.fail(new NotFoundError('Role not found')))
        }

        if (
            Object.values(DEFAULT_ROLES)
                .map(r => r.toLowerCase())
                .includes(actual.name.toLowerCase())
        ) {
            return yield* _(Effect.fail(new InvalidInputError('Reserved Role')))
        }

        const existing = yield* _(
            Effect.tryPromise({
                try: () => prisma.role.findUnique({ where: { name } }),
                catch: err => new UnexpectedError(err),
            }),
        )

        if (existing) {
            return yield* _(
                Effect.fail(
                    new AlreadyExistsError(actual.id, 'Role already exists'),
                ),
            )
        }

        // 4. Insertar nuevo archivo
        const created = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.role.update({ data: { name }, where: { id } }),
                catch: err => new UnexpectedError(err),
            }),
        )

        return created
    })
