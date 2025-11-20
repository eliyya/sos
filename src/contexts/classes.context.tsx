'use client'

import { useSearchClasses } from '@/hooks/classes.hooks'
import { createContext } from 'react'

export const SearchClassesContext = createContext<
    ReturnType<typeof useSearchClasses>
>(undefined!)

interface SearchClassesProviderProps {
    children: React.ReactNode
}
export function SearchClassesProvider({
    children,
}: SearchClassesProviderProps) {
    const searchData = useSearchClasses()
    return (
        <SearchClassesContext.Provider value={searchData}>
            {children}
        </SearchClassesContext.Provider>
    )
}
