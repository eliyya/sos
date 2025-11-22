'use client'

import { useSearchLaboratories } from '@/hooks/laboratories.hoohs'
import { createContext } from 'react'

export const SearchLaboratoriesContext = createContext<
    ReturnType<typeof useSearchLaboratories>
>(undefined!)

interface SearchLaboratoriesProviderProps {
    children: React.ReactNode
}
export function SearchLaboratoriesProvider({
    children,
}: SearchLaboratoriesProviderProps) {
    const searchData = useSearchLaboratories()
    console.log('provider')

    return (
        <SearchLaboratoriesContext.Provider value={searchData}>
            {children}
        </SearchLaboratoriesContext.Provider>
    )
}
