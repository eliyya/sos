import { getCareers } from '@/actions/careers.actions'
import { careersAtom } from '@/global/careers.globals'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const isCareersFetchedAtom = atom(false)

export function useCareers() {
    const [careers, setCareers] = useAtom(careersAtom)
    const [isFetched, setIsFetched] = useAtom(isCareersFetchedAtom)

    const refetchCareers = useCallback(
        () => getCareers().then(setCareers),
        [setCareers],
    )

    useEffect(() => {
        if (!isFetched) {
            refetchCareers()
            setIsFetched(true)
        }
    }, [setCareers, isFetched, setIsFetched, refetchCareers])

    return {
        careers,
        setCareers,
        refetchCareers,
    } as const
}
