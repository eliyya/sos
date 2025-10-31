import { searchStudents } from '@/actions/students.actions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'

export type SearchStudentsPromise = ReturnType<typeof searchStudents>
export function useSearchStudents() {
    const [query, setQuery] = useQueryParam('q', '')
    const [archived, setArchived] = useQueryParam('archived', false)
    const [studentsPromise, setStudentsPromise] =
        useState<SearchStudentsPromise>(
            Promise.resolve({ students: [], count: 0 }),
        )
    const [page, setPage] = useState(1)

    const filters = useMemo(
        () => ({ query, archived, page }),
        [query, archived, page],
    )

    const refreshStudents = useCallback(
        () => setStudentsPromise(searchStudents(filters)),
        [filters],
    )

    const changeFilters = useCallback(
        ({
            query,
            archived,
            page,
        }: {
            query?: string
            archived?: boolean
            page?: number
        }) => {
            if (typeof query === 'string') setQuery(query)
            if (typeof archived === 'boolean') setArchived(archived)
            if (typeof page === 'number') setPage(page)
            refreshStudents()
        },
        [setQuery, setArchived, setPage, refreshStudents],
    )
    useEffect(() => {
        refreshStudents()
    }, [])

    return {
        filters,
        changeFilters,
        studentsPromise,
        refreshStudents,
    }
}
