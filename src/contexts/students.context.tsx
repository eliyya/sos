'use client'

import { useSearchEntity } from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchStudentsContext = createContext<
    ReturnType<typeof useSearchEntity<'students'>>
>(undefined!)

interface SearchStudentsProviderProps {
    children: React.ReactNode
}
export function SearchStudentsProvider({
    children,
}: SearchStudentsProviderProps) {
    const searchData = useSearchEntity('students')
    return (
        <SearchStudentsContext.Provider value={searchData}>
            {children}
        </SearchStudentsContext.Provider>
    )
}
