import { Effect } from 'effect'
import { requirePermission } from './auth.service'
import { PermissionsFlags } from '@/bitfields/PermissionsBitField'
import { PrismaService } from '@/layers/db.layer'
import { LABORATORY_TYPE, MACHINE_STATUS, STATUS } from '@/prisma/client'
import {
    AlreadyArchivedError,
    AlreadyExistsError,
    InvalidInputError,
    NotFoundError,
    PrismaError,
} from '@/errors'

interface CreateLaboratoryProps {
    name: string
    open_hour: number
    close_hour: number
    type: LABORATORY_TYPE
}
export const createLaboratoryEffect = ({
    close_hour,
    name,
    open_hour,
    type,
}: CreateLaboratoryProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        if (!name)
            return yield* _(
                Effect.fail(new InvalidInputError('name', 'Name is required')),
            )
        if (!type)
            return yield* _(
                Effect.fail(new InvalidInputError('type', 'Type is required')),
            )
        if (
            type !== LABORATORY_TYPE.LABORATORY &&
            type !== LABORATORY_TYPE.COMPUTER_CENTER
        )
            return yield* _(
                Effect.fail(new InvalidInputError('type', 'Type is required')),
            )
        if (open_hour < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'open_hour',
                        'Hours must be positive',
                    ),
                ),
            )
        if (close_hour < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'close_hour',
                        'Hours must be positive',
                    ),
                ),
            )
        if (open_hour <= close_hour)
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'close_hour',
                        'Close hour must be greater than open hour',
                    ),
                ),
            )

        const lab = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.laboratory.findUnique({
                        where: { name },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (lab) {
            if (lab.status === STATUS.ARCHIVED)
                return yield* _(
                    Effect.fail(
                        new AlreadyArchivedError(
                            lab.id,
                            'Laboratory already archived',
                        ),
                    ),
                )
            return yield* _(
                Effect.fail(
                    new AlreadyExistsError(lab.id, 'Laboratory already exists'),
                ),
            )
        }

        const created = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.laboratory.create({
                        data: { name, open_hour, close_hour, type },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return created
    })

export const editLaboratoryEffect = ({
    close_hour,
    name,
    open_hour,
    type,
}: Partial<CreateLaboratoryProps>) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const lab = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.laboratory.findUnique({
                        where: { name },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!lab)
            return yield* _(
                Effect.fail(new NotFoundError('Laboratory not found')),
            )
        if (lab.status !== STATUS.ACTIVE)
            return yield* _(
                Effect.fail(new NotFoundError('Laboratory not found')),
            )

        name ||= lab.name
        open_hour ??= lab.open_hour
        close_hour ??= lab.close_hour
        type ??= lab.type

        if (open_hour <= close_hour)
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'close_hour',
                        'Close hour must be greater than open hour',
                    ),
                ),
            )

        if (lab.name !== name) {
            const exists = yield* _(
                Effect.tryPromise({
                    try: () =>
                        prisma.laboratory.findUnique({
                            where: { name },
                        }),
                    catch: err => new PrismaError(err),
                }),
            )
            if (exists)
                return yield* _(
                    Effect.fail(
                        new AlreadyExistsError(
                            exists.id,
                            'Laboratory already exists',
                        ),
                    ),
                )
        }

        if (
            lab.type !== LABORATORY_TYPE.LABORATORY &&
            lab.type !== LABORATORY_TYPE.COMPUTER_CENTER
        )
            return yield* _(
                Effect.fail(new InvalidInputError('type', 'Type is not valid')),
            )

        if (open_hour < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'open_hour',
                        'Open hour must be positive',
                    ),
                ),
            )
        if (close_hour < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'close_hour',
                        'Close hour must be positive',
                    ),
                ),
            )

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.laboratory.update({
                        where: { name },
                        data: { name, open_hour, close_hour, type },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return updated
    })

export const deleteLaboratoryEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const lab = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.laboratory.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!lab)
            return yield* _(
                Effect.fail(new NotFoundError('Laboratory not found')),
            )
        if (lab.status === STATUS.DELETED) return

        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.$transaction(async prisma => {
                        await prisma.laboratory.update({
                            where: { id },
                            data: {
                                status: STATUS.DELETED,
                                close_hour: 0,
                                open_hour: 0,
                                name: id,
                            },
                        })
                        await prisma.machine.updateMany({
                            where: {
                                laboratory_id: id,
                                status: MACHINE_STATUS.IN_USE,
                            },
                            data: {
                                laboratory_id: null,
                                status: MACHINE_STATUS.AVAILABLE,
                            },
                        })
                        await prisma.machine.updateMany({
                            where: {
                                laboratory_id: id,
                            },
                            data: {
                                laboratory_id: null,
                            },
                        })
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })

export const archiveLaboratoryEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PermissionsFlags.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const lab = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.laboratory.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!lab)
            return yield* _(
                Effect.fail(new NotFoundError('Laboratory not found')),
            )
        if (lab.status === STATUS.DELETED)
            return yield* _(
                Effect.fail(new NotFoundError('Laboratory not found')),
            )
        if (lab.status === STATUS.ARCHIVED) return lab

        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.laboratory.update({
                        where: { id },
                        data: { status: STATUS.ARCHIVED },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })
