import { getCareers } from '@/actions/careers.actions'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'
import { Career } from '@/prisma/generated/client'

const isCareersFetchedAtom = atom(false)
const careersAtom = atom<Career[]>([])

export function useCareers() {
    const [careers, setCareers] = useAtom(careersAtom)
    const [isFetched, setIsFetched] = useAtom(isCareersFetchedAtom)

    const refetchCareers = useCallback(
        () => getCareers().then(setCareers),
        [setCareers],
    )

    const activeCareers = useMemo(() => {
        return careers.filter(t => t.status === STATUS.ACTIVE)
    }, [careers])

    useEffect(() => {
        if (!isFetched) {
            refetchCareers()
            setIsFetched(true)
        }
    }, [setCareers, isFetched, setIsFetched, refetchCareers])

    return {
        careers,
        setCareers,
        activeCareers,
        refetchCareers,
    } as const
}
