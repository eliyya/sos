'use client'

import { useSearchEntity } from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchUsersContext = createContext<
    ReturnType<typeof useSearchEntity<'users'>>
>(undefined!)

interface SearchUsersProviderProps {
    children: React.ReactNode
}
export function SearchUsersProvider({ children }: SearchUsersProviderProps) {
    const searchData = useSearchEntity('users')
    return (
        <SearchUsersContext.Provider value={searchData}>
            {children}
        </SearchUsersContext.Provider>
    )
}
