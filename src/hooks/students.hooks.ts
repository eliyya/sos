import { searchStudents } from '@/actions/students.actions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'

export type SearchStudentsPromise = ReturnType<typeof searchStudents>
export function useSearchStudents() {
    const [query, setQuery] = useQueryParam('q', '')
    const [archived, setArchived] = useQueryParam('archived', false)
    const [studentsPromise, setStudentsPromise] =
        useState<SearchStudentsPromise>(Promise.resolve([]))

    const filters = useMemo(() => ({ query, archived }), [query, archived])

    const refreshStudents = useCallback(
        () => setStudentsPromise(searchStudents(filters)),
        [filters],
    )

    const changeFilters = useCallback(
        ({ query, archived }: { query?: string; archived?: boolean }) => {
            if (typeof query === 'string') setQuery(query)
            if (typeof archived === 'boolean') setArchived(archived)
            refreshStudents()
        },
        [setQuery, setArchived, refreshStudents],
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
