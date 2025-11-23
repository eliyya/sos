'use client'

import { useSearchEntity } from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchCareersContext = createContext<
    ReturnType<typeof useSearchEntity<'careers'>>
>(undefined!)

interface SearchCareersProviderProps {
    children: React.ReactNode
}
export function SearchCareersProvider({
    children,
}: SearchCareersProviderProps) {
    const searchData = useSearchEntity('careers')
    return (
        <SearchCareersContext.Provider value={searchData}>
            {children}
        </SearchCareersContext.Provider>
    )
}
