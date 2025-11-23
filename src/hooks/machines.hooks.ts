import { searchMachines } from '@/actions/search.actions'
import { useCallback, useMemo, useState } from 'react'
import { ChangeProps, createSearchParams, propsParser } from '@/lib/utils'
import app from '@eliyya/type-routes'
import {
    parseAsBoolean,
    parseAsInteger,
    parseAsString,
    useQueryState,
} from 'nuqs'

export type SearchMachinesPromise = ReturnType<typeof searchMachines>

type Filters = {
    query: string
    maintenance: boolean
    page: number
    size: number
}
export function useSearchMachines() {
    const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))
    const [maintenance, setMaintenance] = useQueryState(
        'maintenance',
        parseAsBoolean.withDefault(false),
    )
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
    const [size, setSize] = useQueryState(
        'size',
        parseAsInteger.withDefault(10),
    )
    const [refresh, setRefresh] = useState(Symbol())

    const filters = useMemo(
        () => ({ query, maintenance, page, size }),
        [query, maintenance, page, size],
    )

    const changeFilters = useCallback(
        (props: ChangeProps<Filters>) => {
            props = propsParser(props, filters)
            if (typeof props.query === 'string') setQuery(props.query)
            if (typeof props.maintenance === 'boolean')
                setMaintenance(props.maintenance)
            if (typeof props.page === 'number') setPage(props.page)
            if (typeof props.size === 'number') setSize(props.size)
        },
        [filters, setQuery, setMaintenance, setPage, setSize],
    )

    const refreshMachines = useCallback(
        () => setRefresh(Symbol()),
        [setRefresh],
    )

    const machinesPromise: SearchMachinesPromise = useMemo(
        () =>
            fetch(
                `${app.api.pagination.machines()}?${createSearchParams(filters)}`,
            )
                .then(res => res.json())
                .catch(() => ({ machines: [], count: 0 })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [refresh, filters],
    )

    return {
        filters,
        changeFilters,
        machinesPromise,
        refreshMachines,
    }
}
