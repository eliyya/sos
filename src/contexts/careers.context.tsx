'use client'

import {
    SearchContext,
    useFiltersBase,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchCareersContext = createContext<
    SearchContext<'careers', typeof useFiltersBase>
>(undefined!)

interface SearchCareersProviderProps {
    children: React.ReactNode
}
export function SearchCareersProvider({
    children,
}: SearchCareersProviderProps) {
    const filters = useFiltersBase()
    const searchData = useSearchEntity('careers', filters)
    return (
        <SearchCareersContext.Provider value={searchData}>
            {children}
        </SearchCareersContext.Provider>
    )
}
