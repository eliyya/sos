'use client'

import { useSearchEntity } from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchLaboratoriesContext = createContext<
    ReturnType<typeof useSearchEntity<'laboratories'>>
>(undefined!)

interface SearchLaboratoriesProviderProps {
    children: React.ReactNode
}
export function SearchLaboratoriesProvider({
    children,
}: SearchLaboratoriesProviderProps) {
    const searchData = useSearchEntity('laboratories')

    return (
        <SearchLaboratoriesContext.Provider value={searchData}>
            {children}
        </SearchLaboratoriesContext.Provider>
    )
}
