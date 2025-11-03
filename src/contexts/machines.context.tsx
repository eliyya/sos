'use client'

import { useSearchMachines } from '@/hooks/machines.hooks'
import { createContext } from 'react'

export const SearchMachinesContext = createContext<
    ReturnType<typeof useSearchMachines>
>(undefined!)

interface SearchMachinesProviderProps {
    children: React.ReactNode
}
export function SearchMachinesProvider({
    children,
}: SearchMachinesProviderProps) {
    const searchData = useSearchMachines()
    return (
        <SearchMachinesContext.Provider value={searchData}>
            {children}
        </SearchMachinesContext.Provider>
    )
}
