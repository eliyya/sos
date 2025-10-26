import { getLaboratories } from '@/actions/laboratories.actions'
import { laboratoriesAtom } from '@/global/laboratories.globals'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

const isLaboratoriesFetchedAtom = atom(false)

export function useLaboratories() {
    const [laboratories, setLaboratories] = useAtom(laboratoriesAtom)
    const [isFetched, setIsFetched] = useAtom(isLaboratoriesFetchedAtom)

    const refetchLaboratories = useCallback(
        () => getLaboratories().then(setLaboratories),
        [setLaboratories],
    )

    const activeLaboratories = useMemo(() => {
        return laboratories.filter(t => t.status === STATUS.ACTIVE)
    }, [laboratories])

    useEffect(() => {
        if (!isFetched) {
            refetchLaboratories()
            setIsFetched(true)
        }
    }, [setLaboratories, isFetched, setIsFetched, refetchLaboratories])

    return {
        laboratories,
        setLaboratories,
        activeLaboratories,
        refetchLaboratories,
    } as const
}
