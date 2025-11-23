'use client'

import {
    SearchContext,
    useFiltersBase,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchClassesContext = createContext<
    SearchContext<'classes', typeof useFiltersBase>
>(undefined!)

interface SearchClassesProviderProps {
    children: React.ReactNode
}
export function SearchClassesProvider({
    children,
}: SearchClassesProviderProps) {
    const filters = useFiltersBase()
    const searchData = useSearchEntity('classes', filters)
    return (
        <SearchClassesContext.Provider value={searchData}>
            {children}
        </SearchClassesContext.Provider>
    )
}
