import { getCareers, searchCareers } from '@/actions/careers.actions'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'
import { ChangeProps, createSearchParams, propsParser } from '@/lib/utils'
import app from '@eliyya/type-routes'
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

export type SearchCareersPromise = ReturnType<typeof searchCareers>

type Filters = {
    query: string
    archived: boolean
    page: number
    size: number
}
export function useSearchCareers() {
    const [query, setQuery] = useQueryParam('q', '')
    const [archived, setArchived] = useQueryParam('archived', false)
    const [page, setPage] = useQueryParam('page', 1)
    const [size, setSize] = useQueryParam('size', 10)
    const [refresh, setRefresh] = useState(Symbol())

    const filters = useMemo(
        () => ({ query, archived, page, size }),
        [query, archived, page, size],
    )

    const changeFilters = useCallback(
        (props: ChangeProps<Filters>) => {
            props = propsParser(props, filters)
            if (typeof props.query === 'string') setQuery(props.query)
            if (typeof props.archived === 'boolean') setArchived(props.archived)
            if (typeof props.page === 'number') setPage(props.page)
            if (typeof props.size === 'number') setSize(props.size)
        },
        [filters, setQuery, setArchived, setPage, setSize],
    )

    const refreshCareers = useCallback(() => setRefresh(Symbol()), [setRefresh])

    const careersPromise: SearchCareersPromise = useMemo(
        () =>
            fetch(
                `${app.api.pagination.careers()}?${createSearchParams(filters)}`,
            )
                .then(res => res.json())
                .catch(() => ({ users: [], count: 0 })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [refresh, filters],
    )

    return {
        filters,
        changeFilters,
        careersPromise,
        refreshCareers,
    }
}
