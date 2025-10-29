import { getStudents, searchStudents } from '@/actions/students.actions'
import { studentsAtom } from '@/global/students.globals'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'
import { Student } from '@/prisma/generated/browser'

const isStudentsFetchedAtom = atom(false)

export function useStudents() {
    const [students, setStudents] = useAtom(studentsAtom)
    const [isFetched, setIsFetched] = useAtom(isStudentsFetchedAtom)

    const refetchStudents = useCallback(
        () => getStudents().then(setStudents),
        [setStudents],
    )

    const activeStudents = useMemo(() => {
        return students.filter(t => t.status === STATUS.ACTIVE)
    }, [students])

    useEffect(() => {
        if (!isFetched) {
            refetchStudents()
            setIsFetched(true)
        }
    }, [setStudents, isFetched, setIsFetched, refetchStudents])

    return {
        students,
        setStudents,
        refetchStudents,
    } as const
}

export function useSearchStudents() {
    const [query] = useQueryParam('q', '')
    const [archived] = useQueryParam('archived', false)
    const [studentsPromise, setStudentsPromise] = useState<Promise<Student[]>>(
        Promise.resolve([]),
    )

    useEffect(() => {
        setStudentsPromise(searchStudents({ query, archived }))
    }, [query, archived])

    return { query, archived, studentsPromise } as const
}
