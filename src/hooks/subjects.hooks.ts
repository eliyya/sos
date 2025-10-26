import { getSubjects } from '@/actions/subjects.actions'
import { subjectsAtom } from '@/global/subjects.globals'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

const isSubjectsFetchedAtom = atom(false)

export function useSubjects() {
    const [subjects, setSubjects] = useAtom(subjectsAtom)
    const [isFetched, setIsFetched] = useAtom(isSubjectsFetchedAtom)

    const refetchSubjects = useCallback(
        () => getSubjects().then(setSubjects),
        [setSubjects],
    )

    const activeSubjects = useMemo(() => {
        return subjects.filter(t => t.status === STATUS.ACTIVE)
    }, [subjects])

    useEffect(() => {
        if (!isFetched) {
            refetchSubjects()
            setIsFetched(true)
        }
    }, [setSubjects, isFetched, setIsFetched, refetchSubjects])

    return {
        subjects,
        setSubjects,
        activeSubjects,
        refetchSubjects,
    } as const
}
