import { getCareers, searchCareers } from '@/actions/careers.actions'
import { careersAtom } from '@/global/careers.globals'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'

const isCareersFetchedAtom = atom(false)

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

export type SearchCareersPromise = ReturnType<typeof searchCareers>
export function useSearchCareers() {
    const [query] = useQueryParam('q', '')
    const [archived] = useQueryParam('archived', false)
    const [careersPromise, setCareersPromise] = useState<SearchCareersPromise>(
        Promise.resolve([]),
    )

    const filters = useMemo(() => ({ query, archived }), [query, archived])

    const refreshCareers = useCallback(() => {
        setCareersPromise(searchCareers(filters))
    }, [filters])

    useEffect(() => {
        refreshCareers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        filters,
        careersPromise,
        refreshCareers,
    } as const
}
