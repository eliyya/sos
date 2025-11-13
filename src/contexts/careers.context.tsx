'use client'

import { useSearchCareers } from '@/hooks/careers.hooks'
import { createContext } from 'react'

export const SearchCareersContext = createContext<
    ReturnType<typeof useSearchCareers>
>(undefined!)

interface SearchCareersProviderProps {
    children: React.ReactNode
}
export function SearchCareersProvider({
    children,
}: SearchCareersProviderProps) {
    const searchData = useSearchCareers()
    return (
        <SearchCareersContext.Provider value={searchData}>
            {children}
        </SearchCareersContext.Provider>
    )
}
