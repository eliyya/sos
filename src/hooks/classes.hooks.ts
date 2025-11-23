import { searchClasses } from '@/actions/search.actions'
import { useCallback, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'
import { ChangeProps, createSearchParams, propsParser } from '@/lib/utils'
import app from '@eliyya/type-routes'

export type SearchClassesPromise = ReturnType<typeof searchClasses>

type Filters = {
    query: string
    archived: boolean
    page: number
    size: number
}
export function useSearchClasses() {
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

    const refreshClasses = useCallback(() => setRefresh(Symbol()), [setRefresh])

    const classesPromise: SearchClassesPromise = useMemo(
        () =>
            fetch(
                `${app.api.pagination.classes()}?${createSearchParams(filters)}`,
            )
                .then(res => res.json())
                .catch(() => ({ classes: [], count: 0 })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [refresh, filters],
    )

    return {
        filters,
        changeFilters,
        classesPromise,
        refreshClasses,
    }
}
