'use client'

import { useSearchStudents } from '@/hooks/students.hooks'
import { createContext } from 'react'

export const SearchStudentsContext = createContext<
    ReturnType<typeof useSearchStudents>
>(undefined!)

interface SearchStudentsProviderProps {
    children: React.ReactNode
}
export function SearchStudentsProvider({
    children,
}: SearchStudentsProviderProps) {
    const searchData = useSearchStudents()
    return (
        <SearchStudentsContext.Provider value={searchData}>
            {children}
        </SearchStudentsContext.Provider>
    )
}
