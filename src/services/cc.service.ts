import { Effect } from 'effect'
import { NotAllowedError, PrismaError } from '@/errors'
import { PrismaService } from '@/layers/db.layer'
import { requirePermission } from './auth.service'
import { PERMISSIONS_FLAGS } from '@/bitfields/PermissionsBitField'
import { createStudentEffect } from './students.service'

export function registerVisitEffect({
    student_nc,
    laboratory_id,
    career_id,
    firstname,
    lastname,
    group,
    semester,
}: {
    student_nc: string
    laboratory_id: string
    career_id?: string
    firstname?: string
    lastname?: string
    group?: number
    semester?: number
}) {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.SESSION_CC))
        const prisma = yield* _(PrismaService)

        const student = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.student.findFirst({
                        where: { nc: student_nc },
                        select: { nc: true },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        if (!student) {
            yield* _(
                createStudentEffect({
                    nc: student_nc,
                    career_id: career_id!,
                    firstname: firstname!,
                    lastname: lastname!,
                    group: group!,
                    semester: semester!,
                }),
            )
        }

        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0))
        const endOfDay = new Date(today.setHours(23, 59, 59, 999))

        const is_yet = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.visit.findFirst({
                        select: { id: true },
                        where: {
                            laboratory_id,
                            created_at: {
                                gte: startOfDay,
                                lte: endOfDay,
                            },
                            student_nc,
                            exit_at: null,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        if (is_yet) {
            return Effect.fail(
                new NotAllowedError('Ya existe una visita registrada'),
            )
        }

        const visit = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.visit.create({
                        data: {
                            student_nc,
                            laboratory_id,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )
        return visit
    })
}

export function getTodayVisitsEffect({
    laboratory_id,
}: {
    laboratory_id: string
}) {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0))
        const endOfDay = new Date(today.setHours(23, 59, 59, 999))

        const visits = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.visit.findMany({
                        where: {
                            laboratory_id,
                            created_at: {
                                gte: startOfDay,
                                lte: endOfDay,
                            },
                            exit_at: null,
                        },
                        include: {
                            student: true,
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return visits
    })
}

export function endVisitEffect({ id }: { id: string }) {
    return Effect.gen(function* (_) {
        yield* _(requirePermission(PERMISSIONS_FLAGS.SESSION_CC))
        const prisma = yield* _(PrismaService)

        const visits = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.visit.update({
                        where: { id },
                        data: {
                            exit_at: new Date(),
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return visits
    })
}
