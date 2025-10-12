import { Effect } from 'effect'
import { requirePermission } from './auth.service'
import { PERMISSIONS_FLAGS } from '@/bitfields/PermissionsBitField'
import { PrismaService } from '@/layers/db.layer'
import {
    AlreadyArchivedError,
    InvalidInputError,
    NotFoundError,
    PrismaError,
} from '@/errors'
import { STATUS } from '@/prisma/generated/enums'

interface CreateCareerProps {
    name: string
    alias: string | null
}
export const createCareerEffect = ({ name, alias }: CreateCareerProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_CAREERS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.career.findFirst({
                        where: { OR: [{ name }, { alias }] },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (exists) {
            if (exists.status === STATUS.ARCHIVED)
                return yield* _(
                    Effect.fail(
                        new AlreadyArchivedError(
                            exists.id,
                            'Career already archived',
                        ),
                    ),
                )
            if (exists.name === name)
                return yield* _(
                    Effect.fail(
                        new InvalidInputError('name', 'Career already exists'),
                    ),
                )
            if (exists.alias === alias)
                return yield* _(
                    Effect.fail(
                        new InvalidInputError('alias', 'Career already exists'),
                    ),
                )
        }
        const career = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.career.create({
                        data: { name, alias },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return yield* _(Effect.succeed(career))
    })

interface EditCarrerEffectProps extends Partial<CreateCareerProps> {
    id: string
}
export const editCareerEffect = ({ id, name, alias }: EditCarrerEffectProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_CAREERS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () => prisma.career.findUnique({ where: { id } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!exists) {
            return yield* _(Effect.fail(new NotFoundError('Career not found')))
        }
        const repeat = yield* _(
            Effect.tryPromise({
                try: () => {
                    return prisma.career.findFirst({
                        where: { OR: [{ name }, { alias }] },
                    })
                },
                catch: err => new PrismaError(err),
            }),
        )
        if (repeat) {
            if (repeat.name === name)
                return yield* _(
                    Effect.fail(
                        new InvalidInputError('name', 'Career already exists'),
                    ),
                )
            if (repeat.alias === alias)
                return yield* _(
                    Effect.fail(
                        new InvalidInputError('alias', 'Career already exists'),
                    ),
                )
        }
        name ||= exists.name
        alias ||= exists.alias
        const career = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.career.update({
                        where: { id },
                        data: { name, alias },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return yield* _(Effect.succeed(career))
    })

export const deleteCareerEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_CAREERS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () => prisma.career.findUnique({ where: { id } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!exists) {
            return yield* _(Effect.fail(new NotFoundError('Career not found')))
        }
        if (exists.status === STATUS.DELETED) return
        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.career.update({
                        where: { id },
                        data: {
                            status: STATUS.DELETED,
                            alias: null,
                            name: id,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        // TODO: manage career dependents
    })

export const archiveCareerEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_CAREERS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () => prisma.career.findUnique({ where: { id } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!exists) {
            return yield* _(Effect.fail(new NotFoundError('Career not found')))
        }
        if (exists.status === STATUS.ARCHIVED)
            return yield* _(Effect.succeed(exists))
        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.career.update({
                        where: { id },
                        data: {
                            status: STATUS.ARCHIVED,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })

export const unarchiveCareerEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_CAREERS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () => prisma.career.findUnique({ where: { id } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!exists) {
            return yield* _(Effect.fail(new NotFoundError('Career not found')))
        }
        if (exists.status === STATUS.ACTIVE)
            return yield* _(Effect.succeed(exists))
        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.career.update({
                        where: { id },
                        data: {
                            status: STATUS.ACTIVE,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })

export const getCareersEffect = () =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const careers = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.career.findMany({
                        where: {
                            status: {
                                not: STATUS.DELETED,
                            },
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return yield* _(Effect.succeed(careers))
    })
