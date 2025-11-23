'use client'

import { useSearchEntity } from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchSubjectsContext = createContext<
    ReturnType<typeof useSearchEntity<'subjects'>>
>(undefined!)

interface SearchSubjectsProviderProps {
    children: React.ReactNode
}
export function SearchSubjectsProvider({
    children,
}: SearchSubjectsProviderProps) {
    const searchData = useSearchEntity('subjects')
    return (
        <SearchSubjectsContext.Provider value={searchData}>
            {children}
        </SearchSubjectsContext.Provider>
    )
}
