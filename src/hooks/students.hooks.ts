import { getStudents, searchStudents } from '@/actions/students.actions'
import { studentsAtom } from '@/global/students.globals'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryParam } from './query.hooks'
import { Student } from '@/prisma/generated/browser'
import { useSearchParams } from 'next/navigation'

const isStudentsFetchedAtom = atom(false)

export function useStudents() {
    const [students, setStudents] = useAtom(studentsAtom)
    const [isFetched, setIsFetched] = useAtom(isStudentsFetchedAtom)

    const refetchStudents = useCallback(
        () => getStudents().then(setStudents),
        [setStudents],
    )

    const activeStudents = useMemo(() => {
        return students.filter(t => t.status === STATUS.ACTIVE)
    }, [students])

    useEffect(() => {
        if (!isFetched) {
            refetchStudents()
            setIsFetched(true)
        }
    }, [setStudents, isFetched, setIsFetched, refetchStudents])

    return {
        students,
        setStudents,
        refetchStudents,
    } as const
}

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
