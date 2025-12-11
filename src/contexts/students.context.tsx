'use client'

import {
    SearchContext,
    useFiltersBase,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchStudentsContext = createContext<
    SearchContext<'students', typeof useFiltersBase>
>(undefined!)

interface SearchStudentsProviderProps {
    children: React.ReactNode
}
export function SearchStudentsProvider({
    children,
}: SearchStudentsProviderProps) {
    const filters = useFiltersBase()
    const searchData = useSearchEntity('students', filters)
    return (
        <SearchStudentsContext.Provider value={searchData}>
            {children}
        </SearchStudentsContext.Provider>
    )
}
