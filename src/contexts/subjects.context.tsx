'use client'

import { useSearchSubjects } from '@/hooks/subjects.hooks'
import { createContext } from 'react'

export const SearchSubjectsContext = createContext<
    ReturnType<typeof useSearchSubjects>
>(undefined!)

interface SearchSubjectsProviderProps {
    children: React.ReactNode
}
export function SearchSubjectsProvider({
    children,
}: SearchSubjectsProviderProps) {
    const searchData = useSearchSubjects()
    return (
        <SearchSubjectsContext.Provider value={searchData}>
            {children}
        </SearchSubjectsContext.Provider>
    )
}
