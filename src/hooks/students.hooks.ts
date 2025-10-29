import { getStudents } from '@/actions/students.actions'
import { studentsAtom } from '@/global/students.globals'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'
import { useQueryParam } from './query.hooks'

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
    const [q] = useQueryParam('q', '')
    const [a] = useQueryParam('archived', false)
    const studentsPromise = getStudents({ q, archived: a })
    return { query: q, archived: a, studentsPromise } as const
}
