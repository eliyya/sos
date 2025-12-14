import { Effect } from 'effect'
import {
    BetterAuthAPIError,
    BetterError,
    InvalidInputError,
    NotAllowedError,
    NotFoundError,
    PrismaError,
} from '@/errors'
import { PrismaService } from '@/layers/db.layer'
import { STATUS } from '@/prisma/generated/enums'
import { DEFAULT_PAGINATION, DEFAULT_ROLES } from '@/constants/client'
import { AuthService } from '@/layers/auth.layer'
import { db } from '@/prisma/db'
import { requirePermission } from './auth.service'
import { PERMISSIONS_FLAGS } from '@/bitfields/PermissionsBitField'
import { APIError } from 'better-auth'

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
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_USERS))
        const prisma = yield* _(PrismaService)

        const user = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.findFirst({
                        where: { id },
                        include: { permissions_role: true },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!user)
            return yield* _(Effect.fail(new NotFoundError('User not found')))
        if (user.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('User not found')))
        if (user.status === STATUS.ARCHIVED) return user

        if (user.permissions_role.name === DEFAULT_ROLES.ADMIN) {
            const adminCount = yield* _(
                Effect.tryPromise({
                    try: () =>
                        prisma.user.count({
                            where: {
                                permissions_role: { name: DEFAULT_ROLES.ADMIN },
                            },
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
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_USERS))
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
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_USERS))
        const prisma = yield* _(PrismaService)

        const user = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.user.findFirst({
                        where: { id },
                        include: { permissions_role: true },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!user)
            return yield* _(Effect.fail(new NotFoundError('User not found')))
        if (user.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('User not found')))

        if (user.permissions_role.name === DEFAULT_ROLES.ADMIN) {
            const adminCount = yield* _(
                Effect.tryPromise({
                    try: () =>
                        prisma.user.count({
                            where: {
                                permissions_role: {
                                    name: DEFAULT_ROLES.ADMIN,
                                },
                            },
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
                            permissions_role: {
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
}: Partial<EditUserEffectProps>) {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_USERS))

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
                Effect.fail(
                    new InvalidInputError({
                        field: 'password',
                        message: 'Password is required',
                    }),
                ),
            )
        if (!/[A-Z]/.test(password))
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'password',
                        message:
                            'Password must contain at least one uppercase letter',
                    }),
                ),
            )
        if (!/[a-z]/.test(password))
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'password',
                        message:
                            'Password must contain at least one lowercase letter',
                    }),
                ),
            )
        if (!/[0-9]/.test(password))
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'password',
                        message: 'Password must contain at least one number',
                    }),
                ),
            )
        if (!/[!@#$%^&*]/.test(password))
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'password',
                        message:
                            'Password must contain at least one special character',
                    }),
                ),
            )
        if (password.length < 10)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'password',
                        message: 'Password must be at least 10 characters long',
                    }),
                ),
            )
    })
}

interface SearchUsersProps {
    query?: string
    archived?: boolean
    page?: number
    size?: number
}
export const searchUsersEffect = ({
    query = '',
    archived = false,
    page = DEFAULT_PAGINATION.PAGE,
    size = DEFAULT_PAGINATION.SIZE,
}: SearchUsersProps) =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const [users, count] = yield* _(
            Effect.tryPromise({
                try: () =>
                    Promise.all([
                        prisma.user.findMany({
                            skip: (page - 1) * size,
                            take: size,
                            where: {
                                status:
                                    archived ? STATUS.ARCHIVED : STATUS.ACTIVE,
                                OR: [
                                    {
                                        name: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        username: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            },
                            include: {
                                permissions_role: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        }),
                        prisma.user.count({
                            where: {
                                status:
                                    archived ? STATUS.ARCHIVED : STATUS.ACTIVE,
                                OR: [
                                    {
                                        name: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        username: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            },
                        }),
                    ]),
                catch: err => new PrismaError(err),
            }),
        )

        const usersMapped = users.map(user => ({
            ...user,
            role: {
                name: user.permissions_role.name,
            },
        }))

        return {
            users: usersMapped,
            pages: Math.ceil(count / size || 1),
        }
    })

export function createUserEffect({
    password,
    name,
    username,
    role_id,
}: {
    password: string
    name: string
    username: string
    role_id: string
}) {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_USERS))

        const auth = yield* _(AuthService)
        const api = auth.getApi()

        console.log({ password, name, username, role_id })

        const data = yield* _(
            Effect.tryPromise({
                try: () =>
                    api.createUser({
                        body: {
                            email: `${username}@noemail.local`,
                            name,
                            password,
                            data: {
                                username,
                                role_id,
                                displayUsername: username,
                            },
                        },
                    }),
                catch: err => {
                    if (err instanceof APIError) {
                        return new BetterAuthAPIError({
                            code: err.body?.code ?? 'UNKNOWN_ERROR',
                            name: err.name,
                            message: err.message,
                            status: err.status,
                            statusCode: err.statusCode,
                        })
                    } else {
                        return new BetterError({ cause: err })
                    }
                },
            }),
        )

        return data
    })
}
