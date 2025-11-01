import { searchStudents } from '@/actions/students.actions'
import { useCallback, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'
import app from '@eliyya/type-routes'
import { createSearchParams } from '@/lib/utils'

export type SearchStudentsPromise = ReturnType<typeof searchStudents>

type Filters = {
    query: string
    archived: boolean
    page: number
    size: number
}
type ChangeFiltersProps =
    | Partial<Filters>
    | ((filters: Filters) => Partial<Filters>)
export function useSearchStudents() {
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
        (props: ChangeFiltersProps) => {
            props = propsParser(props, filters)
            if (typeof props.query === 'string') setQuery(props.query)
            if (typeof props.archived === 'boolean') setArchived(props.archived)
            if (typeof props.page === 'number') setPage(props.page)
            if (typeof props.size === 'number') setSize(props.size)
        },
        [setQuery, setArchived, setPage, setSize],
    )

    const refreshStudents = useCallback(
        () => setRefresh(Symbol()),
        [setRefresh],
    )

    const studentsPromise: SearchStudentsPromise = useMemo(
        () =>
            fetch(
                `${app.api.pagination.students()}?${createSearchParams(filters)}`,
            )
                .then(res => res.json())
                .catch(() => ({ students: [], count: 0 })),
        [refresh, filters],
    )

    return {
        filters,
        changeFilters,
        studentsPromise,
        refreshStudents,
    }
}

function propsParser(props: ChangeFiltersProps, filters: Filters) {
    if (typeof props === 'function') {
        return props(filters) as Partial<Filters>
    }
    return props as Partial<Filters>
}
