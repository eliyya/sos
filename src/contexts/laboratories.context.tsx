'use client'

import {
    SearchContext,
    useFiltersBase,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchLaboratoriesContext = createContext<
    SearchContext<'laboratories', typeof useFiltersBase>
>(undefined!)

interface SearchLaboratoriesProviderProps {
    children: React.ReactNode
}
export function SearchLaboratoriesProvider({
    children,
}: SearchLaboratoriesProviderProps) {
    const filters = useFiltersBase()
    const searchData = useSearchEntity('laboratories', filters)

    return (
        <SearchLaboratoriesContext.Provider value={searchData}>
            {children}
        </SearchLaboratoriesContext.Provider>
    )
}
