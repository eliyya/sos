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
import { DEFAULT_PAGINATION } from '@/constants/client'

interface CreateStudentProps {
    nc: string
    lastname: string
    firstname: string
    semester?: number
    group?: number
    career_id: string
}
export const createStudentEffect = ({
    nc,
    lastname,
    firstname,
    semester,
    group,
    career_id,
}: CreateStudentProps) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        if (!lastname)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'lastname',
                        message: 'Lastname is required',
                    }),
                ),
            )
        if (!firstname)
            return yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'firstname',
                        message: 'Firstname is required',
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
                    prisma.student.findUnique({
                        where: { nc },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (exists) {
            if (exists.status === STATUS.ARCHIVED)
                return yield* _(
                    Effect.fail(
                        new AlreadyArchivedError(
                            exists.nc,
                            'Student already archived',
                        ),
                    ),
                )
            return yield* _(
                Effect.fail(
                    new AlreadyExistsError(exists.nc, 'Student already exists'),
                ),
            )
        }

        const created = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.create({
                        data: {
                            nc,
                            lastname,
                            firstname,
                            semester,
                            group,
                            career_id,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return created
    })

export const editStudentEffect = ({
    nc,
    lastname,
    firstname,
    semester,
    group,
    career_id,
}: Partial<CreateStudentProps & { nc: string }>) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const student = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.findUnique({
                        where: { nc },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!student)
            return yield* _(Effect.fail(new NotFoundError('Student not found')))
        if (student.status !== STATUS.ACTIVE)
            return yield* _(Effect.fail(new NotFoundError('Student not found')))

        lastname ||= student.lastname
        firstname ||= student.firstname
        semester ??= student.semester
        group ??= student.group
        career_id ||= student.career_id

        const updated = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.update({
                        where: { nc },
                        data: {
                            lastname,
                            firstname,
                            semester,
                            group,
                            career_id,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return updated
    })

export const deleteStudentEffect = (nc: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const student = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.findUnique({
                        where: { nc },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!student)
            return yield* _(Effect.fail(new NotFoundError('Student not found')))
        if (student.status === STATUS.DELETED) return

        yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.update({
                        where: { nc },
                        data: {
                            status: STATUS.DELETED,
                            firstname: nc,
                            lastname: nc,
                            semester: 0,
                            group: 0,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
    })

export const archiveStudentEffect = (nc: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.findUnique({
                        where: { nc },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!exists)
            return yield* _(Effect.fail(new NotFoundError('Student not found')))
        if (exists.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('Student not found')))
        if (exists.status === STATUS.ARCHIVED) return exists

        const student = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.update({
                        where: { nc },
                        data: { status: STATUS.ARCHIVED },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return student
    })

export const unarchiveStudentEffect = (nc: string) =>
    Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.MANAGE_LABS))

        const prisma = yield* _(PrismaService)

        const exists = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.findUnique({
                        where: { nc },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!exists)
            return yield* _(Effect.fail(new NotFoundError('Student not found')))
        if (exists.status === STATUS.DELETED)
            return yield* _(Effect.fail(new NotFoundError('Student not found')))
        if (exists.status === STATUS.ACTIVE) return exists

        const student = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.update({
                        where: { nc },
                        data: { status: STATUS.ACTIVE },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return student
    })

export const getStudentsEffect = () =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        return yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.findMany({
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

interface SearchStudentsProps {
    query?: string
    archived?: boolean
    page?: number
    size?: number
}
export const searchStudentsEffect = ({
    query = '',
    archived = false,
    page = DEFAULT_PAGINATION.PAGE,
    size = DEFAULT_PAGINATION.SIZE,
}: SearchStudentsProps) =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const [students, count] = yield* _(
            Effect.tryPromise({
                try: () =>
                    Promise.all([
                        prisma.student.findMany({
                            skip: (page - 1) * size,
                            take: size,
                            where: {
                                status:
                                    archived ? STATUS.ARCHIVED : STATUS.ACTIVE,
                                OR: [
                                    {
                                        nc: {
                                            contains: query,
                                        },
                                    },
                                    {
                                        lastname: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        firstname: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            },
                            include: {
                                career: {
                                    select: {
                                        alias: true,
                                        status: true,
                                    },
                                },
                            },
                        }),
                        prisma.student.count({
                            where: {
                                status:
                                    archived ? STATUS.ARCHIVED : STATUS.ACTIVE,
                                OR: [
                                    {
                                        nc: {
                                            contains: query,
                                        },
                                    },
                                    {
                                        lastname: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        firstname: {
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

        const studentsParsed = students.map(student => {
            return {
                ...student,
                career: {
                    ...student.career,
                    displayalias:
                        student.career.status === STATUS.ACTIVE ?
                            student.career.alias
                        : student.career.status === STATUS.ARCHIVED ?
                            `(Archived) ${student.career.alias}`
                        :   `Deleted`,
                    displayname:
                        student.status === STATUS.ACTIVE ?
                            `${student.firstname} ${student.lastname}`
                        : student.status === STATUS.ARCHIVED ?
                            `(Archived) ${student.firstname} ${student.lastname}`
                        :   `Deleted`,
                },
            }
        })

        return {
            students: studentsParsed,
            count,
        }
    })

export const getStudentEffect = (nc: string) =>
    Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const student = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.findUnique({
                        where: { nc },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        if (!student) return null
        if (student.status === STATUS.DELETED) return null

        return student
    })
