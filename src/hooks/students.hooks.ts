import { getStudents } from '@/actions/students.actions'
import { studentsAtom } from '@/global/students.globals'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const isStudentsFetchedAtom = atom(false)

export function useStudents() {
    const [students, setStudents] = useAtom(studentsAtom)
    const [isFetched, setIsFetched] = useAtom(isStudentsFetchedAtom)

    const refetchStudents = useCallback(
        () => getStudents().then(setStudents),
        [setStudents],
    )

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
