import { getClasses } from '@/actions/classes.actions'
import { classesAtom } from '@/global/classes.globals'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

const isClassesFetchedAtom = atom(false)

export function useClasses() {
    const [classes, setClasses] = useAtom(classesAtom)
    const [isFetched, setIsFetched] = useAtom(isClassesFetchedAtom)

    const refetchClasses = useCallback(
        () => getClasses().then(setClasses),
        [setClasses],
    )

    const activeClasses = useMemo(
        () => classes.filter(c => c.status === STATUS.ACTIVE),
        [classes],
    )

    useEffect(() => {
        if (!isFetched) {
            refetchClasses()
            setIsFetched(true)
        }
    }, [setClasses, isFetched, setIsFetched, refetchClasses])

    return {
        classes,
        setClasses,
        activeClasses,
        refetchClasses,
    } as const
}
