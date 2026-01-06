'use client'

import {
    SearchContext,
    useFiltersBase,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext, startTransition, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLaboratoryAction } from '@/actions/laboratories.actions'
import { Laboratory } from '@/prisma/generated/browser'

export const SearchLaboratoriesContext = createContext<
    SearchContext<'laboratories', typeof useFiltersBase>
>(undefined!)

interface SearchLaboratoriesProviderProps {
    children: React.ReactNode
}
export function SearchLaboratoriesProvider({
    children,
}: SearchLaboratoriesProviderProps) {
    const filters = useFiltersBase()
    const searchData = useSearchEntity('laboratories', filters)

    return (
        <SearchLaboratoriesContext.Provider value={searchData}>
            {children}
        </SearchLaboratoriesContext.Provider>
    )
}

export const CurrentLaboratoryContext = createContext<
    ReturnType<typeof useCurrentLaboratory>
>(undefined!)

interface SearchLaboratoriesProviderProps {
    children: React.ReactNode
}
export function CurrentLaboratoryProvider({
    children,
}: SearchLaboratoriesProviderProps) {
    const searchData = useCurrentLaboratory()

    return (
        <CurrentLaboratoryContext.Provider value={searchData}>
            {children}
        </CurrentLaboratoryContext.Provider>
    )
}

function useCurrentLaboratory() {
    const { id } = useParams<{ id: string }>()
    const [laboratory, setLaboratory] = useState<Laboratory | null>(null)

    useEffect(() => {
        startTransition(async () => {
            const lab = await getLaboratoryAction(id)
            setLaboratory(lab)
        })
    }, [id])

    return { laboratory }
}
