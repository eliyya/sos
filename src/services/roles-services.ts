import { Effect } from 'effect'

import {
    InvalidInputError,
    AlreadyExistsError,
    UnexpectedError,
    NotFoundError,
} from '../errors'
import { PrismaService } from '../prisma/db'

import {
    DB_STATES,
    DEFAULT_PERMISSIONS,
    DEFAULT_ROLES,
} from '@/constants/client'

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

        name = name.trim().replace(/\s/g, '-')

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

export const createNewRoleEffect = () =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        const count = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.states.findUnique({
                        where: { name: DB_STATES.ROLES_COUNT },
                        select: { value: true },
                    }),
                catch: err => new UnexpectedError(err),
            }).pipe(Effect.map(c => (c?.value ?? 0) + 1)),
        )

        const name = `Role-${count}`

        const created = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.$transaction(async tx => {
                        const created = await tx.role.create({
                            data: {
                                name,
                                permissions: DEFAULT_PERMISSIONS.USER,
                            },
                        })
                        await tx.states.update({
                            where: { name: DB_STATES.ROLES_COUNT },
                            data: { value: count },
                        })
                        return created
                    }),
                catch: err => new UnexpectedError(err),
            }),
        )

        return created
    })

export const deleteRoleEffect = (id: string) =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.$transaction(async prisma => {
                        prisma.user.updateMany({
                            where: { role_id: id },
                            data: { role_id: DEFAULT_ROLES.USER },
                        })
                        prisma.role.delete({ where: { id } })
                    }),
                catch: err => new UnexpectedError(err),
            }),
        )
    })
