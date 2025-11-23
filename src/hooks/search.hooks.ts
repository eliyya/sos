'use client'
import type {
    searchSubjects,
    searchCareers,
    searchClasses,
    searchLaboratories,
    searchMachines,
    searchStudents,
    searchUsers,
} from '@/actions/search.actions'
import { useCallback, useMemo, useState } from 'react'
import { ChangeProps, createSearchParams, propsParser } from '@/lib/utils'
import app from '@eliyya/type-routes'
import {
    parseAsBoolean,
    parseAsInteger,
    parseAsString,
    useQueryState,
} from 'nuqs'

export type SearchSubjectsPromise = ReturnType<typeof searchSubjects>
export type SearchCareersPromise = ReturnType<typeof searchCareers>
export type SearchClassesPromise = ReturnType<typeof searchClasses>
export type SearchLaboratoriesPromise = ReturnType<typeof searchLaboratories>
export type SearchMachinesPromise = ReturnType<typeof searchMachines>
export type SearchStudentsPromise = ReturnType<typeof searchStudents>
export type SearchUsersPromise = ReturnType<typeof searchUsers>

type EntityPromise<T extends Entity> =
    T extends 'subjects' ? SearchSubjectsPromise
    : T extends 'careers' ? SearchCareersPromise
    : T extends 'classes' ? SearchClassesPromise
    : T extends 'laboratories' ? SearchLaboratoriesPromise
    : T extends 'machines' ? SearchMachinesPromise
    : T extends 'students' ? SearchStudentsPromise
    : T extends 'users' ? SearchUsersPromise
    : never

type Filters = {
    query: string
    archived: boolean
    page: number
    size: number
}
type Entity = keyof typeof app.api.pagination
export function useSearchEntity<T extends Entity>(entity: T) {
    const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))
    const [archived, setArchived] = useQueryState(
        'archived',
        parseAsBoolean.withDefault(false),
    )
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
    const [size, setSize] = useQueryState(
        'size',
        parseAsInteger.withDefault(10),
    )
    const [forceRefresh, setRefresh] = useState(Symbol())

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

    const refresh = useCallback(() => setRefresh(Symbol()), [])

    const promise: EntityPromise<T> = useMemo(
        () =>
            fetch(
                `${app.api.pagination[entity]()}?${createSearchParams(filters)}`,
            )
                .then(res => res.json())
                .catch(() => ({ [entity]: [], count: 1 })) as EntityPromise<T>,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [forceRefresh, filters],
    )

    return {
        filters,
        changeFilters,
        promise,
        refresh,
    }
}
