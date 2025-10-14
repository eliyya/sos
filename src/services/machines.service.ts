import { PERMISSIONS_FLAGS } from '@/bitfields/PermissionsBitField'
import { Effect } from 'effect'
import { requirePermission } from './auth.service'
import { PrismaService } from '@/layers/db.layer'
import { MACHINE_STATUS } from '@/prisma/generated/enums'
import {
    AlreadyArchivedError,
    InvalidInputError,
    NotFoundError,
    PrismaError,
} from '@/errors'

interface CreateMachineProps {
    number: number
    status: MACHINE_STATUS
    processor: string
    ram: string
    storage: string
    description: string
    serie?: string
    laboratory_id?: string
}
export const createMachineEffect = ({
    number,
    status,
    processor,
    ram,
    storage,
    description,
    serie,
    laboratory_id,
}: CreateMachineProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_MACHINES))

        const prisma = yield* _(PrismaService)

        if (serie) {
            const machine = yield* _(
                Effect.tryPromise({
                    try: () => prisma.machine.findUnique({ where: { serie } }),
                    catch: err => new PrismaError(err),
                }),
            )
            if (machine) {
                if (machine.status === MACHINE_STATUS.OUT_OF_SERVICE) {
                    return yield* _(
                        Effect.fail(
                            new AlreadyArchivedError(
                                machine.id,
                                'Machine is out of service',
                            ),
                        ),
                    )
                }
                return yield* _(
                    Effect.fail(
                        new InvalidInputError(
                            'serie',
                            'Machine already exists',
                        ),
                    ),
                )
            }
        }
        const machine = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.machine.create({
                        data: {
                            number,
                            status,
                            processor,
                            ram,
                            storage,
                            description,
                            serie,
                            laboratory_id,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return yield* _(Effect.succeed(machine))
    })

interface EditMachineProps extends Partial<CreateMachineProps> {
    id: string
}
export const editMachineEffect = ({
    id,
    description,
    laboratory_id,
    number,
    processor,
    ram,
    serie,
    status,
    storage,
}: EditMachineProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_MACHINES))

        const prisma = yield* _(PrismaService)

        const machine = yield* _(
            Effect.tryPromise({
                try: () => prisma.machine.findUnique({ where: { id } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!machine)
            return yield* _(Effect.fail(new NotFoundError('Machine not found')))
        if (machine.status !== MACHINE_STATUS.OUT_OF_SERVICE)
            return yield* _(Effect.fail(new NotFoundError('Machine not found')))
        if (serie) {
            const machine = yield* _(
                Effect.tryPromise({
                    try: () => prisma.machine.findUnique({ where: { serie } }),
                    catch: err => new PrismaError(err),
                }),
            )
            if (machine) {
                return yield* _(
                    Effect.fail(
                        new InvalidInputError(
                            'serie',
                            'Machine already exists',
                        ),
                    ),
                )
            }
        }

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.machine.update({
                        where: { id },
                        data: {
                            number,
                            status,
                            processor,
                            ram,
                            storage,
                            description,
                            serie,
                            laboratory_id,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return yield* _(Effect.succeed(updated))
    })

export const deleteMachineEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_MACHINES))

        const prisma = yield* _(PrismaService)

        const machine = yield* _(
            Effect.tryPromise({
                try: () => prisma.machine.findUnique({ where: { id } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!machine)
            return yield* _(Effect.fail(new NotFoundError('Machine not found')))
        if (machine.status !== MACHINE_STATUS.OUT_OF_SERVICE) return

        const deleted = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.machine.update({
                        where: { id },
                        data: {
                            status: MACHINE_STATUS.OUT_OF_SERVICE,
                            serie: null,
                            laboratory_id: null,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return yield* _(Effect.succeed(deleted))
    })

//    MACHINE_STATUS.MAINTENANCE
export const maintainanceMachineEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_MACHINES))

        const prisma = yield* _(PrismaService)

        const machine = yield* _(
            Effect.tryPromise({
                try: () => prisma.machine.findUnique({ where: { id } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!machine)
            return yield* _(Effect.fail(new NotFoundError('Machine not found')))
        if (machine.status !== MACHINE_STATUS.MAINTENANCE) return machine

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.machine.update({
                        where: { id },
                        data: {
                            status: MACHINE_STATUS.MAINTENANCE,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return yield* _(Effect.succeed(updated))
    })

export const availableMachineEffect = (id: string) => {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_MACHINES))

        const prisma = yield* _(PrismaService)

        const machine = yield* _(
            Effect.tryPromise({
                try: () => prisma.machine.findUnique({ where: { id } }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!machine)
            return yield* _(Effect.fail(new NotFoundError('Machine not found')))
        if (machine.status !== MACHINE_STATUS.AVAILABLE) return machine

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.machine.update({
                        where: { id },
                        data: {
                            status: MACHINE_STATUS.AVAILABLE,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return yield* _(Effect.succeed(updated))
    })
}

export const getMachinesEffect = () => {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const machines = yield* _(
            Effect.tryPromise({
                try: () => prisma.machine.findMany(),
                catch: err => new PrismaError(err),
            }),
        )

        return yield* _(Effect.succeed(machines))
    })
}
