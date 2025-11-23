'use client'

import {
    SearchContext,
    useFiltersMachines,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchMachinesContext = createContext<
    SearchContext<'machines', typeof useFiltersMachines>
>(undefined!)

interface SearchMachinesProviderProps {
    children: React.ReactNode
}
export function SearchMachinesProvider({
    children,
}: SearchMachinesProviderProps) {
    const { filters, changeFilters } = useFiltersMachines()
    const searchData = useSearchEntity('machines', { filters, changeFilters })
    return (
        <SearchMachinesContext.Provider value={searchData}>
            {children}
        </SearchMachinesContext.Provider>
    )
}
