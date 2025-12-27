'use client'
import type {
    searchSubjects,
    searchCareers,
    searchClassesAction,
    searchLaboratories,
    searchMachines,
    searchStudents,
    searchUsers,
} from '@/actions/search.actions'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
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
export type SearchClassesPromise = ReturnType<typeof searchClassesAction>
export type SearchLaboratoriesPromise = ReturnType<typeof searchLaboratories>
export type SearchMachinesPromise = ReturnType<typeof searchMachines>
export type SearchStudentsPromise = ReturnType<typeof searchStudents>
export type SearchUsersPromise = ReturnType<typeof searchUsers>

type EntityPromise<T extends SearchEntity> =
    T extends 'subjects' ? SearchSubjectsPromise
    : T extends 'careers' ? SearchCareersPromise
    : T extends 'classes' ? SearchClassesPromise
    : T extends 'laboratories' ? SearchLaboratoriesPromise
    : T extends 'machines' ? SearchMachinesPromise
    : T extends 'students' ? SearchStudentsPromise
    : T extends 'users' ? SearchUsersPromise
    : never

export type SearchEntity = keyof typeof app.api.pagination

export type SearchFilters = Record<string, string | number | boolean>

export type SearchContext<
    E extends SearchEntity,
    F extends () => {
        filters: SearchFilters
        changeFilters: (props: ChangeProps<SearchFilters>) => void
    },
> = ReturnType<typeof useSearchEntity<E, ReturnType<F>['filters']>>

export function useSearchEntity<
    E extends SearchEntity,
    F extends SearchFilters,
>(
    entity: E,
    {
        filters,
        changeFilters,
    }: { filters: F; changeFilters: (props: ChangeProps<F>) => void },
) {
    const [forceRefresh, setRefresh] = useState(Symbol())
    const [promise, setPromise] = useState(
        () =>
            Promise.resolve({
                [entity]: [],
                pages: 1,
            }) as unknown as EntityPromise<E>,
    )
    const [data, setData] = useState({ [entity]: [], pages: 1 } as Awaited<
        EntityPromise<E>
    >)
    const [inProgress, starTransition] = useTransition()

    useEffect(() => {
        const promise = search(entity, filters)
        setPromise(promise)
        starTransition(() => {
            promise.then(data => setData(data as Awaited<EntityPromise<E>>))
        })
    }, [entity, filters, forceRefresh])

    const refresh = useCallback(() => setRefresh(Symbol()), [])

    return {
        filters,
        changeFilters,
        refresh,
        promise,
        inProgress,
        data,
    }
}

function search<E extends SearchEntity>(
    entity: E,
    filters: Record<string, string | number | boolean>,
) {
    return fetch(
        `${app.api.pagination[entity]()}?${createSearchParams(filters)}`,
    )
        .then(res => res.json())
        .catch(() => ({ [entity]: [], pages: 1 })) as EntityPromise<E>
}

export function useFiltersBase() {
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

    const filters = useMemo(
        () => ({ query, archived, page, size }),
        [query, archived, page, size],
    )

    const changeFilters = useCallback(
        (props: ChangeProps<typeof filters>) => {
            props = propsParser(props, filters)
            if (typeof props.query === 'string') setQuery(props.query)
            if (typeof props.archived === 'boolean') setArchived(props.archived)
            if (typeof props.page === 'number') setPage(props.page)
            if (typeof props.size === 'number') setSize(props.size)
        },
        [filters, setQuery, setArchived, setPage, setSize],
    )

    return {
        filters,
        changeFilters,
    }
}

export function useFiltersMachines() {
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

    const filters = useMemo(
        () => ({ query, maintenance, page, size }),
        [query, maintenance, page, size],
    )

    const changeFilters = useCallback(
        (props: ChangeProps<typeof filters>) => {
            props = propsParser(props, filters)
            if (typeof props.query === 'string') setQuery(props.query)
            if (typeof props.maintenance === 'boolean')
                setMaintenance(props.maintenance)
            if (typeof props.page === 'number') setPage(props.page)
            if (typeof props.size === 'number') setSize(props.size)
        },
        [filters, setQuery, setMaintenance, setPage, setSize],
    )

    return {
        filters,
        changeFilters,
    }
}
