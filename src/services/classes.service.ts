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
import { DEFAULT_PAGINATION } from '@/constants/client'

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
        console.log({ career_id })

        const prisma = yield* _(PrismaService)

        if (!teacher_id)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'teacher_id',
                        message: 'Teacher is required',
                    }),
                ),
            )
        if (!subject_id)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'subject_id',
                        message: 'Subject is required',
                    }),
                ),
            )
        if (!career_id)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'career_id',
                        message: 'Career is required',
                    }),
                ),
            )
        if (semester && semester < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'semester',
                        message: 'Semester must be positive',
                    }),
                ),
            )
        if (group && group < 0)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'group',
                        message: 'Group must be positive',
                    }),
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

        const classes = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.findMany({
                        where: {
                            status: {
                                not: STATUS.DELETED,
                            },
                        },
                        include: {
                            teacher: {
                                select: {
                                    name: true,
                                    status: true,
                                },
                            },
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        const classProcessed = classes.map(class_ => ({
            ...class_,
            teacher: {
                name: class_.teacher.name,
                displayname:
                    class_.teacher.status === STATUS.ACTIVE ?
                        class_.teacher.name
                    : class_.teacher.status === STATUS.ARCHIVED ?
                        `(Archived) ${class_.teacher.name}`
                    : class_.teacher.status === STATUS.DELETED ? `Deleted user`
                    : class_.teacher.name,
            },
        }))

        return classProcessed
    })

interface SearchClassesProps {
    query?: string
    archived?: boolean
    page?: number
    size?: number
    teacher_id?: string
}
export const searchClassesEffect = ({
    query = '',
    archived = false,
    teacher_id,
    page = DEFAULT_PAGINATION.PAGE,
    size = DEFAULT_PAGINATION.SIZE,
}: SearchClassesProps) =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const [classes, count] = yield* _(
            Effect.tryPromise({
                try: () =>
                    Promise.all([
                        prisma.class.findMany({
                            skip: (page - 1) * size,
                            take: size,
                            where: {
                                status:
                                    archived ? STATUS.ARCHIVED : STATUS.ACTIVE,
                                teacher_id,
                                OR: [
                                    {
                                        subject: {
                                            name: {
                                                contains: query,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                    {
                                        career: {
                                            name: {
                                                contains: query,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                    {
                                        teacher: {
                                            name: {
                                                contains: query,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                ],
                            },
                            include: {
                                subject: {
                                    select: {
                                        name: true,
                                        status: true,
                                    },
                                },
                                career: {
                                    select: {
                                        name: true,
                                        status: true,
                                    },
                                },
                                teacher: {
                                    select: {
                                        name: true,
                                        status: true,
                                    },
                                },
                            },
                        }),
                        prisma.class.count({
                            where: {
                                status:
                                    archived ? STATUS.ARCHIVED : STATUS.ACTIVE,
                                OR: [
                                    {
                                        subject: {
                                            name: {
                                                contains: query,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                    {
                                        career: {
                                            name: {
                                                contains: query,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                    {
                                        teacher: {
                                            name: {
                                                contains: query,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                ],
                            },
                        }),
                    ]),
                catch: err => new PrismaError(err),
            }),
        )

        const classesProcessed = classes.map(class_ => ({
            ...class_,
            teacher: {
                name: class_.teacher.name,
                displayname:
                    class_.teacher.status === STATUS.ACTIVE ?
                        class_.teacher.name
                    : class_.teacher.status === STATUS.ARCHIVED ?
                        `(Archived) ${class_.teacher.name}`
                    : class_.teacher.status === STATUS.DELETED ? `Deleted user`
                    : class_.teacher.name,
            },
            subject: {
                name: class_.subject.name,
                displayname:
                    class_.subject.status === STATUS.ACTIVE ?
                        class_.subject.name
                    : class_.subject.status === STATUS.ARCHIVED ?
                        `(Archived) ${class_.subject.name}`
                    : class_.subject.status === STATUS.DELETED ?
                        `Deleted subject`
                    :   class_.subject.name,
            },
            career: {
                name: class_.career.name,
                displayname:
                    class_.career.status === STATUS.ACTIVE ? class_.career.name
                    : class_.career.status === STATUS.ARCHIVED ?
                        `(Archived) ${class_.career.name}`
                    : class_.career.status === STATUS.DELETED ? `Deleted career`
                    : class_.career.name,
            },
        }))

        return {
            classes: classesProcessed,
            pages: Math.ceil(count / size || 1),
        }
    })
