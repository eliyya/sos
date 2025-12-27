'use client'

import {
    SearchContext,
    useFiltersBase,
    useSearchEntity,
} from '@/hooks/search.hooks'
import { createContext, startTransition, useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { scheduleUserInformationAction } from '@/actions/users.actions'

export const SearchUsersContext = createContext<
    SearchContext<'users', typeof useFiltersBase>
>(undefined!)

interface SearchUsersProviderProps {
    children: React.ReactNode
}
export function SearchUsersProvider({ children }: SearchUsersProviderProps) {
    const filters = useFiltersBase()
    const searchData = useSearchEntity('users', filters)
    return (
        <SearchUsersContext.Provider value={searchData}>
            {children}
        </SearchUsersContext.Provider>
    )
}

export const ScheduleUserInformationContext = createContext<
    ReturnType<typeof useScheduleUserInformation>
>(undefined!)
export function ScheduleUserInformationProvider({
    children,
}: SearchUsersProviderProps) {
    const searchData = useScheduleUserInformation()
    return (
        <ScheduleUserInformationContext.Provider value={searchData}>
            {children}
        </ScheduleUserInformationContext.Provider>
    )
}

function useScheduleUserInformation() {
    const { data: session } = authClient.useSession()
    const [data, setData] =
        useState<Awaited<ReturnType<typeof scheduleUserInformationAction>>>()
    useEffect(() => {
        if (!session) return
        startTransition(async () => {
            const data = await scheduleUserInformationAction({
                id: session.userId,
            })
            setData(data)
        })
    }, [session])
    return { session, data }
}
