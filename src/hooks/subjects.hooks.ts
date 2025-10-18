import { getSubjects } from '@/actions/subjects.actions'
import { subjectsAtom } from '@/global/subjects.globals'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const isSubjectsFetchedAtom = atom(false)

export function useSubjects() {
    const [subjects, setSubjects] = useAtom(subjectsAtom)
    const [isFetched, setIsFetched] = useAtom(isSubjectsFetchedAtom)

    const refetchSubjects = useCallback(
        () => getSubjects().then(setSubjects),
        [setSubjects],
    )

    useEffect(() => {
        if (!isFetched) {
            refetchSubjects()
            setIsFetched(true)
        }
    }, [setSubjects, isFetched, setIsFetched, refetchSubjects])

    return {
        subjects,
        setSubjects,
        refetchSubjects,
    } as const
}
