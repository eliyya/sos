import { getLaboratories } from '@/actions/laboratories.actions'
import { laboratoriesAtom } from '@/global/laboratories.globals'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const isLaboratoriesFetchedAtom = atom(false)

export function useLaboratories() {
    const [laboratories, setLaboratories] = useAtom(laboratoriesAtom)
    const [isFetched, setIsFetched] = useAtom(isLaboratoriesFetchedAtom)

    const refetchLaboratories = useCallback(
        () => getLaboratories().then(setLaboratories),
        [setLaboratories],
    )

    useEffect(() => {
        if (!isFetched) {
            refetchLaboratories()
            setIsFetched(true)
        }
    }, [setLaboratories, isFetched, setIsFetched, refetchLaboratories])

    return {
        laboratories,
        setLaboratories,
        refetchLaboratories,
    } as const
}
