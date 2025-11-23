import { PERMISSIONS_FLAGS } from '@/bitfields/PermissionsBitField'
import { Effect } from 'effect'
import { requirePermission } from './auth.service'
import { PrismaService } from '@/layers/db.layer'
import {
    AlreadyArchivedError,
    AlreadyExistsError,
    InvalidInputError,
    NotFoundError,
    PrismaError,
} from '@/errors'
import { STATUS } from '@/prisma/generated/client'
import { DEFAULT_PAGINATION } from '@/constants/client'

interface CreateSubjectProps {
    name: string
    theory_hours: number
    practice_hours: number
}
export const createSubjectEffect = ({
    name,
    theory_hours,
    practice_hours,
}: CreateSubjectProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_SUBJECTS))

        const prisma = yield* _(PrismaService)

        if (!name)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'name',
                        message: 'Name is required',
                    }),
                ),
            )
        if (theory_hours < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'theory_hours',
                        message: 'Theory hours must be positive',
                    }),
                ),
            )
        if (practice_hours < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'practice_hours',
                        message: 'Practice hours must be positive',
                    }),
                ),
            )

        const subject = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.findUnique({
                        where: { name },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (subject) {
            if (subject.status === STATUS.ARCHIVED)
                return yield* _(
                    Effect.fail(
                        new AlreadyArchivedError(
                            subject.id,
                            'Subject already archived',
                        ),
                    ),
                )
            return yield* _(
                Effect.fail(
                    new AlreadyExistsError(
                        subject.id,
                        'Subject already exists',
                    ),
                ),
            )
        }
        const created = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.create({
                        data: { name, theory_hours, practice_hours },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return created
    })

interface EditSubjectProps extends Partial<CreateSubjectProps> {
    id: string
}
export const editSubjectEffect = ({
    id,
    name,
    theory_hours,
    practice_hours,
}: EditSubjectProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_SUBJECTS))

        const prisma = yield* _(PrismaService)

        const subject2 = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.findUnique({
                        where: { name },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (subject2) {
            if (subject2.status === STATUS.ARCHIVED)
                return yield* _(
                    Effect.fail(
                        new AlreadyArchivedError(
                            subject2.id,
                            'Subject already archived',
                        ),
                    ),
                )
            return yield* _(
                Effect.fail(
                    new AlreadyExistsError(
                        subject2.id,
                        'Subject already exists',
                    ),
                ),
            )
        }

        const subject = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!subject)
            return yield* _(Effect.fail(new NotFoundError('Subject not found')))

        name ||= subject.name
        theory_hours ??= subject.theory_hours
        practice_hours ??= subject.practice_hours

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.update({
                        where: { name },
                        data: { name, theory_hours, practice_hours },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return updated
    })

export const archiveSubjectEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_SUBJECTS))

        const prisma = yield* _(PrismaService)

        const subject = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!subject)
            return yield* _(Effect.fail(new NotFoundError('Subject not found')))
        if (subject.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('Subject not found')))
        if (subject.status === STATUS.ARCHIVED) return subject

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.update({
                        where: { id },
                        data: { status: STATUS.ARCHIVED },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return updated
    })

export const unarchiveSubjectEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_SUBJECTS))

        const prisma = yield* _(PrismaService)

        const subject = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!subject)
            return yield* _(Effect.fail(new NotFoundError('Subject not found')))
        if (subject.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('Subject not found')))
        if (subject.status === STATUS.ACTIVE) return subject

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.update({
                        where: { id },
                        data: { status: STATUS.ACTIVE },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return updated
    })

export const deleteSubjectEffect = (id: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_SUBJECTS))

        const prisma = yield* _(PrismaService)

        const subject = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!subject)
            return yield* _(Effect.fail(new NotFoundError('Subject not found')))
        if (subject.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('Subject not found')))

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.subject.update({
                        where: { id },
                        data: { status: STATUS.DELETED },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return updated
    })

export const getSubjectsEffect = () =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        return yield* _(
            Effect.tryPromise({
                try: () => prisma.subject.findMany(),
                catch: err => new PrismaError(err),
            }),
        )
    })

interface SearchSubjectsProps {
    query?: string
    archived?: boolean
    page?: number
    size?: number
}
export const searchSubjectsEffect = ({
    query = '',
    archived = false,
    page = DEFAULT_PAGINATION.PAGE,
    size = DEFAULT_PAGINATION.SIZE,
}: SearchSubjectsProps) =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const [subjects, count] = yield* _(
            Effect.tryPromise({
                try: () =>
                    Promise.all([
                        prisma.subject.findMany({
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
                                ],
                            },
                        }),
                        prisma.subject.count({
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
                                ],
                            },
                        }),
                    ]),
                catch: err => new PrismaError(err),
            }),
        )

        return {
            subjects,
            pages: Math.ceil(count / size || 1),
        }
    })
