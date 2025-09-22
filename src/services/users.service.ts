import { Effect } from 'effect'
import {
    InvalidInputError,
    NotAllowedError,
    NotFoundError,
    PrismaError,
} from '@/errors'
import { PrismaService } from '@/layers/db.layer'
import { STATUS } from '@/prisma/enums'
import { DEFAULT_ROLES } from '@/constants/client'
import { AuthService } from '@/layers/auth.layer'
import { db } from '@/prisma/db'
import { requirePermission } from './auth.service'
import { PermissionsFlags } from '@/bitfields/PermissionsBitField'

export function getUsersEffect() {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        return yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.findMany({ where: { status: STATUS.ACTIVE } }),
                catch: err => new PrismaError(err),
            }),
        )
    })
}

export function checkIfUsernameIsTakenEffect(username: string) {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        const user = yield* _(
            Effect.tryPromise({
                try: () => prisma.user.findFirst({ where: { username } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!user) return { status: 'available' as const, user }
        if (user.status === STATUS.ARCHIVED)
            return { status: 'archived' as const, user }
        return { status: 'taken' as const, user }
    })
}

export function archiveUserEffect(id: string) {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_USERS))
        const prisma = yield* _(PrismaService)

        const user = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.findFirst({
                        where: { id },
                        include: { role: true },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!user)
            return yield* _(Effect.fail(new NotFoundError('User not found')))
        if (user.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('User not found')))
        if (user.status === STATUS.ARCHIVED) return user

        if (user.role.name === DEFAULT_ROLES.ADMIN) {
            const adminCount = yield* _(
                Effect.tryPromise({
                    try: () =>
                        prisma.user.count({
                            where: { role: { name: DEFAULT_ROLES.ADMIN } },
                        }),
                    catch: err => new PrismaError(err),
                }),
            )
            if (adminCount < 2)
                yield* _(
                    Effect.fail(
                        new NotAllowedError('Unique admin cannot be archived'),
                    ),
                )
        }

        return yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.update({
                        where: { id },
                        data: { status: STATUS.ARCHIVED },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })
}

export function unarchiveUserEffect(id: string) {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_USERS))
        const prisma = yield* _(PrismaService)

        const user = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.findFirst({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!user)
            return yield* _(Effect.fail(new NotFoundError('User not found')))
        if (user.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('User not found')))
        if (user.status === STATUS.ACTIVE) return user

        return yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.update({
                        where: { id },
                        data: { status: STATUS.ACTIVE },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })
}

export function deleteUserEffect(id: string) {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_USERS))
        const prisma = yield* _(PrismaService)

        const user = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.findFirst({
                        where: { id },
                        include: { role: true },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!user)
            return yield* _(Effect.fail(new NotFoundError('User not found')))
        if (user.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('User not found')))

        if (user.role.name === DEFAULT_ROLES.ADMIN) {
            const adminCount = yield* _(
                Effect.tryPromise({
                    try: () =>
                        prisma.user.count({
                            where: { role: { name: DEFAULT_ROLES.ADMIN } },
                        }),
                    catch: err => new PrismaError(err),
                }),
            )
            if (adminCount < 2)
                yield* _(
                    Effect.fail(
                        new NotAllowedError('Unique admin cannot be deleted'),
                    ),
                )
        }

        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.update({
                        where: { id },
                        data: {
                            status: STATUS.DELETED,
                            name: id,
                            username: id,
                            email: id,
                            image: null,
                            display_username: id,
                            role: {
                                connect: {
                                    name: DEFAULT_ROLES.DELETED,
                                },
                            },
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })
}

interface EditUserEffectProps {
    id: string
    name: string
    username: string
    role_id: string
    password?: string
}
export function editUserEffect({
    id,
    name,
    username,
    role_id,
    password,
}: EditUserEffectProps) {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_USERS))

        const prisma = yield* _(PrismaService)
        const auth = yield* _(AuthService)
        const ctx = yield* _(Effect.promise(() => auth.getContext()))

        if (password) yield* _(validatePasswordEffect(password))

        const user = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.update({
                        where: { id },
                        data: { name, username, role_id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!user)
            return yield* _(Effect.fail(new NotFoundError('User not found')))

        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.$transaction(async prisma => {
                        const user = await prisma.user.update({
                            where: { id },
                            data: { name, username, role_id },
                        })
                        if (password) {
                            await prisma.account.updateMany({
                                where: { user_id: id },
                                data: {
                                    password: await ctx.password.hash(password),
                                },
                            })
                            await db.session.deleteMany({
                                where: { user_id: id },
                            })
                        }
                        return user
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })
}

export function validatePasswordEffect(password: string) {
    return Effect.gen(function* (_) {
        if (!password)
            return yield* _(
                Effect.fail(new InvalidInputError('Password is required')),
            )
        if (!/[A-Z]/.test(password))
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'Password must contain at least one uppercase letter',
                    ),
                ),
            )
        if (!/[a-z]/.test(password))
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'Password must contain at least one lowercase letter',
                    ),
                ),
            )
        if (!/[0-9]/.test(password))
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'Password must contain at least one number',
                    ),
                ),
            )
        if (!/[!@#$%^&*]/.test(password))
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'Password must contain at least one special character',
                    ),
                ),
            )
        if (password.length < 10)
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'Password must be at least 10 characters long',
                    ),
                ),
            )
    })
}
