'use client'

import { useSearchEntity } from '@/hooks/search.hooks'
import { createContext } from 'react'

export const SearchClassesContext = createContext<
    ReturnType<typeof useSearchEntity<'classes'>>
>(undefined!)

interface SearchClassesProviderProps {
    children: React.ReactNode
}
export function SearchClassesProvider({
    children,
}: SearchClassesProviderProps) {
    const searchData = useSearchEntity('classes')
    return (
        <SearchClassesContext.Provider value={searchData}>
            {children}
        </SearchClassesContext.Provider>
    )
}
