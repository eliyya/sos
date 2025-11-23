'use server'

import { searchCareersEffect } from '@/services/careers.service'
import { searchClassesEffect } from '@/services/classes.service'
import { searchLaboratoriesEffect } from '@/services/laboratories.service'
import { searchMachinesEffect } from '@/services/machines.service'
import { searchStudentsEffect } from '@/services/students.service'
import { searchSubjectsEffect } from '@/services/subjects.service'
import { searchUsersEffect } from '@/services/users.service'
import { PrismaLive } from '@/layers/db.layer'
import { SuccessOf } from '@/lib/type-utils'
import { Effect } from 'effect'

type SearchSubjectsProps = Parameters<typeof searchSubjectsEffect>[0]
export async function searchSubjects(
    props: SearchSubjectsProps,
): Promise<SuccessOf<ReturnType<typeof searchSubjectsEffect>>> {
    const subjects = await Effect.runPromise(
        Effect.scoped(
            searchSubjectsEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ subjects: [], pages: 1 })
                    }),
                ),
        ),
    )
    return subjects
}

type SearchUsersProps = Parameters<typeof searchUsersEffect>[0]
export async function searchUsers(
    props: SearchUsersProps,
): Promise<SuccessOf<ReturnType<typeof searchUsersEffect>>> {
    const users = await Effect.runPromise(
        Effect.scoped(
            searchUsersEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ users: [], pages: 1 })
                    }),
                ),
        ),
    )
    return users
}

type SearchStudentsProps = Parameters<typeof searchStudentsEffect>[0]
export async function searchStudents(
    props: SearchStudentsProps,
): Promise<SuccessOf<ReturnType<typeof searchStudentsEffect>>> {
    const students = await Effect.runPromise(
        Effect.scoped(
            searchStudentsEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ students: [], pages: 1 })
                    }),
                ),
        ),
    )
    return students
}

type SearchMachinesProps = Parameters<typeof searchMachinesEffect>[0]
export async function searchMachines(
    props: SearchMachinesProps,
): Promise<SuccessOf<ReturnType<typeof searchMachinesEffect>>> {
    const machines = await Effect.runPromise(
        Effect.scoped(
            searchMachinesEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ machines: [], pages: 1 })
                    }),
                ),
        ),
    )
    return machines
}

type SearchLaboratoriesProps = Parameters<typeof searchLaboratoriesEffect>[0]
export async function searchLaboratories(
    props: SearchLaboratoriesProps,
): Promise<SuccessOf<ReturnType<typeof searchLaboratoriesEffect>>> {
    const laboratories = await Effect.runPromise(
        Effect.scoped(
            searchLaboratoriesEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ laboratories: [], pages: 1 })
                    }),
                ),
        ),
    )
    return laboratories
}

type SearchClassesProps = Parameters<typeof searchClassesEffect>[0]
export async function searchClasses(
    props: SearchClassesProps,
): Promise<SuccessOf<ReturnType<typeof searchClassesEffect>>> {
    const classes = await Effect.runPromise(
        Effect.scoped(
            searchClassesEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ classes: [], pages: 1 })
                    }),
                ),
        ),
    )
    return classes
}

type SearchCareersProps = Parameters<typeof searchCareersEffect>[0]
export async function searchCareers(
    props: SearchCareersProps,
): Promise<SuccessOf<ReturnType<typeof searchCareersEffect>>> {
    return await Effect.runPromise(
        Effect.scoped(
            searchCareersEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ careers: [], pages: 1 })
                    }),
                ),
        ),
    )
}
