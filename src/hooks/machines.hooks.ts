import { getMachines } from '@/actions/machines.actions'
import { machinesAtom } from '@/global/machines.globals'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const isMachinesFetchedAtom = atom(false)

export function useMachines() {
    const [machines, setMachines] = useAtom(machinesAtom)
    const [isFetched, setIsFetched] = useAtom(isMachinesFetchedAtom)

    const refetchMachines = useCallback(
        () => getMachines().then(setMachines),
        [setMachines],
    )

    useEffect(() => {
        if (!isFetched) {
            refetchMachines()
            setIsFetched(true)
        }
    }, [setMachines, isFetched, setIsFetched, refetchMachines])

    return {
        machines,
        setMachines,
        refetchMachines,
    } as const
}
