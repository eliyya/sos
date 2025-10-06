import { Effect } from 'effect'
import { requirePermission } from './auth.service'
import { PermissionsFlags } from '@/bitfields/PermissionsBitField'
import { PrismaService } from '@/layers/db.layer'
import { LABORATORY_TYPE, STATUS } from '@/prisma/client'
import {
    AlreadyArchivedError,
    AlreadyExistsError,
    InvalidInputError,
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
