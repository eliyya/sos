import { Effect } from 'effect'
import { requirePermission } from './auth.service'
import { PERMISSIONS_FLAGS } from '@/bitfields/PermissionsBitField'
import { PrismaService } from '@/layers/db.layer'
import { STATUS } from '@/prisma/generated/client'
import {
    AlreadyArchivedError,
    AlreadyExistsError,
    InvalidInputError,
    NotFoundError,
    PrismaError,
} from '@/errors'
import { Class } from '@/prisma/generated/browser'

interface CreateClassProps {
    teacher_id: Class['teacher_id']
    subject_id: Class['subject_id']
    career_id: Class['career_id']
    semester?: Class['semester']
    group?: Class['group']
}
export const createClassEffect = ({
    teacher_id,
    subject_id,
    semester = 1,
    group = 1,
    career_id,
}: CreateClassProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        if (!teacher_id)
            return yield* _(
                Effect.fail(
                    new InvalidInputError('teacher_id', 'Teacher is required'),
                ),
            )
        if (!subject_id)
            return yield* _(
                Effect.fail(
                    new InvalidInputError('subject_id', 'Subject is required'),
                ),
            )
        if (!career_id)
            return yield* _(
                Effect.fail(
                    new InvalidInputError('career_id', 'Career is required'),
                ),
            )
        if (semester && semester < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError(
                        'semester',
                        'Semester must be positive',
                    ),
                ),
            )
        if (group && group < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError('group', 'Group must be positive'),
                ),
            )

        const exists = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.findUnique({
                        where: {
                            unique_class: {
                                career_id,
                                subject_id,
                                teacher_id,
                                group,
                                semester,
                            },
                        },
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
                            'Class already archived',
                        ),
                    ),
                )
            return yield* _(
                Effect.fail(
                    new AlreadyExistsError(exists.id, 'Class already exists'),
                ),
            )
        }

        const created = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.create({
                        data: {
                            subject_id,
                            teacher_id,
                            career_id,
                            semester,
                            group,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return created
    })

export const editClassEffect = ({
    semester,
    group,
    career_id,
    id,
    subject_id,
    teacher_id,
}: Partial<CreateClassProps & { id: Class['id'] }>) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const class_ = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!class_)
            return yield* _(Effect.fail(new NotFoundError('Class not found')))
        if (class_.status !== STATUS.ACTIVE)
            return yield* _(Effect.fail(new NotFoundError('Class not found')))

        semester ??= class_.semester
        group ??= class_.group
        career_id ||= class_.career_id
        subject_id ||= class_.subject_id
        teacher_id ||= class_.teacher_id

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.update({
                        where: { id },
                        data: {
                            semester,
                            group,
                            career_id,
                            subject_id,
                            teacher_id,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return updated
    })

export const deleteClassEffect = (id: Class['id']) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const class_ = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!class_)
            return yield* _(Effect.fail(new NotFoundError('Class not found')))
        if (class_.status === STATUS.DELETED) return

        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.update({
                        where: { id },
                        data: {
                            status: STATUS.DELETED,
                            group: 0,
                            semester: 0,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })

export const archiveClassEffect = (id: Class['id']) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!exists)
            return yield* _(Effect.fail(new NotFoundError('Class not found')))
        if (exists.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('Class not found')))
        if (exists.status === STATUS.ARCHIVED) return exists

        const class_ = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.update({
                        where: { id },
                        data: { status: STATUS.ARCHIVED },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return class_
    })

export const unarchiveClassEffect = (id: Class['id']) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.findUnique({
                        where: { id },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!exists)
            return yield* _(Effect.fail(new NotFoundError('Class not found')))
        if (exists.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('Class not found')))
        if (exists.status === STATUS.ACTIVE) return exists

        const class_ = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.update({
                        where: { id },
                        data: { status: STATUS.ACTIVE },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return class_
    })

export const getClassesEffect = () =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        return yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.findMany({
                        where: {
                            status: {
                                not: STATUS.DELETED,
                            },
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })
