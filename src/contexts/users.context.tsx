'use client'

import {
    SearchContext,
    useFiltersBase,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchUsersContext = createContext<
    SearchContext<'users', typeof useFiltersBase>
>(undefined!)

interface SearchUsersProviderProps {
    children: React.ReactNode
}
export function SearchUsersProvider({ children }: SearchUsersProviderProps) {
    const filters = useFiltersBase()
    const searchData = useSearchEntity('users', filters)
    return (
        <SearchUsersContext.Provider value={searchData}>
            {children}
        </SearchUsersContext.Provider>
    )
}
