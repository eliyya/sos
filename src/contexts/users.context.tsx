'use client'

import { useSearchUsers } from '@/hooks/users.hooks'
import { createContext } from 'react'

export const SearchUsersContext = createContext<
    ReturnType<typeof useSearchUsers>
>(undefined!)

interface SearchUsersProviderProps {
    children: React.ReactNode
}
export function SearchUsersProvider({ children }: SearchUsersProviderProps) {
    const searchData = useSearchUsers()
    return (
        <SearchUsersContext.Provider value={searchData}>
            {children}
        </SearchUsersContext.Provider>
    )
}
