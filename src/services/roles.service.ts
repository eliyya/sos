import { Effect } from 'effect'
import {
    DB_STATES,
    DEFAULT_PERMISSIONS,
    DEFAULT_ROLES,
} from '@/constants/client'
import {
    InvalidInputError,
    AlreadyExistsError,
    UnexpectedError,
    NotFoundError,
    PrismaError,
} from '@/errors'
import { PrismaLive, PrismaService } from '@/layers/db.layer'
import { PermissionsFlags } from '@/bitfields/PermissionsBitField'
import { requirePermission } from './auth.service'
import { PrismaClientKnownRequestError } from '@/prisma/internal/prismaNamespace'

export const editRoleNameEffect = (id: string, name: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_ROLES))

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

class RoleCreationConflictError<T extends string> {
    readonly _tag = 'RoleCreationConflictError'
    constructor(readonly message: T) {}
}
function tryCreateRoleEffect(num: number) {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        const name = `Role-${num}`

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
                            data: { value: num },
                        })
                        return created
                    }),
                catch: err => {
                    if (err instanceof PrismaClientKnownRequestError) {
                        if (err.code === 'P2002') {
                            return new RoleCreationConflictError(
                                'Role name conflict',
                            )
                        } else {
                            return new PrismaError(err)
                        }
                    }
                    return new UnexpectedError(err)
                },
            }),
        )

        return created
    })
}

export const createNewRoleEffect = () =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_ROLES))

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

        return _(
            tryCreateRoleEffect(count)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchTag('RoleCreationConflictError', () =>
                        tryCreateRoleEffect(count + 1),
                    ),
                ),
        )
    })

export const deleteRoleEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_ROLES))
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

export const changuePermissionsEffect = (id: string, permissions: bigint) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_ROLES))
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
        if (actual.name === DEFAULT_ROLES.ADMIN) {
            return yield* _(Effect.fail(new InvalidInputError('Reserved Role')))
        }
        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.role.update({
                        data: { permissions },
                        where: { id },
                    }),
                catch: err => new UnexpectedError(err),
            }),
        )
        return updated
    })

// get users count by roles
export const usersCountPerRoleEffect = () =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        return yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.findMany({
                        where: {
                            role_id: {
                                not: DEFAULT_ROLES.DELETED,
                            },
                        },
                        select: {
                            role_id: true,
                        },
                    }),
                catch: err => new UnexpectedError(err),
            })
                .pipe(Effect.map(users => users.map(u => u.role_id)))
                .pipe(Effect.map(users => Object.groupBy(users, u => u)))
                .pipe(Effect.map(users => Object.entries(users)))
                .pipe(
                    Effect.map(users =>
                        users.map(([id, u]) => ({ id, count: u?.length ?? 0 })),
                    ),
                ),
        )
    })

export function getAdminRoleEffect() {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        const role = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.role.findUnique({
                        where: { name: DEFAULT_ROLES.ADMIN },
                    }),
                catch: err => new UnexpectedError(err),
            }),
        )
        if (role) return role
        const newRole = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.$transaction(async prisma => {
                        const role = await prisma.role.create({
                            data: {
                                name: DEFAULT_ROLES.ADMIN,
                                permissions: DEFAULT_PERMISSIONS.ADMIN,
                            },
                        })
                        await prisma.states.upsert({
                            where: { name: DB_STATES.ROLES_COUNT },
                            create: {
                                name: DB_STATES.ROLES_COUNT,
                                value: 1,
                            },
                            update: {
                                value: {
                                    increment: 1,
                                },
                            },
                        })
                        return role
                    }),
                catch: error => new UnexpectedError(error),
            }),
        )
        if (newRole) return newRole
        return null
    })
}

export function getDeletedRoleEffect() {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        const role = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.role.findUnique({
                        where: { name: DEFAULT_ROLES.DELETED },
                    }),
                catch: err => new UnexpectedError(err),
            }),
        )
        if (role) return role
        const newRole = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.$transaction(async prisma => {
                        const role = await prisma.role.create({
                            data: {
                                name: DEFAULT_ROLES.DELETED,
                                permissions: DEFAULT_PERMISSIONS.DELETED,
                            },
                        })
                        await prisma.states.upsert({
                            where: { name: DB_STATES.ROLES_COUNT },
                            create: {
                                name: DB_STATES.ROLES_COUNT,
                                value: 1,
                            },
                            update: {
                                value: {
                                    increment: 1,
                                },
                            },
                        })
                        return role
                    }),
                catch: error => new UnexpectedError(error),
            }),
        )
        if (newRole) return newRole
        return null
    })
}

export function getRolesEffect() {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        return yield* _(
            Effect.tryPromise({
                try: () => prisma.role.findMany(),
                catch: err => new UnexpectedError(err),
            }),
        )
    })
}
