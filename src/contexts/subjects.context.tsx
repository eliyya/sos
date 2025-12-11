'use client'

import {
    SearchContext,
    useFiltersBase,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchSubjectsContext = createContext<
    SearchContext<'subjects', typeof useFiltersBase>
>(undefined!)

interface SearchSubjectsProviderProps {
    children: React.ReactNode
}
export function SearchSubjectsProvider({
    children,
}: SearchSubjectsProviderProps) {
    const filters = useFiltersBase()
    const searchData = useSearchEntity('subjects', filters)
    return (
        <SearchSubjectsContext.Provider value={searchData}>
            {children}
        </SearchSubjectsContext.Provider>
    )
}
