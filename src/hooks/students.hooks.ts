import { searchStudents } from '@/actions/students.actions'
import { useCallback, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'
import app from '@eliyya/type-routes'
import { ChangeProps, createSearchParams, propsParser } from '@/lib/utils'

export type SearchStudentsPromise = ReturnType<typeof searchStudents>

type Filters = {
    query: string
    archived: boolean
    page: number
    size: number
}
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
        (props: ChangeProps<Filters>) => {
            props = propsParser(props, filters)
            if (typeof props.query === 'string') setQuery(props.query)
            if (typeof props.archived === 'boolean') setArchived(props.archived)
            if (typeof props.page === 'number') setPage(props.page)
            if (typeof props.size === 'number') setSize(props.size)
        },
        [filters, setArchived, setPage, setQuery, setSize],
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters, refresh],
    )

    return {
        filters,
        changeFilters,
        studentsPromise,
        refreshStudents,
    }
}
