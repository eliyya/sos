import { searchStudents } from '@/actions/students.actions'
import { useCallback, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'

export type SearchStudentsPromise = ReturnType<typeof searchStudents>
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
        ({
            query,
            archived,
            page,
            size,
        }: {
            query?: string
            archived?: boolean
            page?: number
            size?: number
        }) => {
            if (typeof query === 'string') setQuery(query)
            if (typeof archived === 'boolean') setArchived(archived)
            if (typeof page === 'number') setPage(page)
            if (typeof size === 'number') setSize(size)
        },
        [setQuery, setArchived, setPage, setSize],
    )

    const refreshStudents = useCallback(
        () => setRefresh(Symbol()),
        [setRefresh],
    )

    const studentsPromise: SearchStudentsPromise = fetch(
        '/api/pagination/students',
    )
        .then(res => res.json())
        .catch(() => ({ students: [], count: 0 }))

    return {
        filters,
        changeFilters,
        studentsPromise,
        refreshStudents,
    }
}
