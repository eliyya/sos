import { getUsers } from '@/actions/users.actions'
import { usersAtom } from '@/global/users.globals'
import { STATUS } from '@/prisma/generated/enums'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

const isUsersFetchedAtom = atom(false)

export function useUsers() {
    const [users, setUsers] = useAtom(usersAtom)
    const [isFetched, setIsFetched] = useAtom(isUsersFetchedAtom)

    const refetchUsers = useCallback(
        () => getUsers().then(setUsers),
        [setUsers],
    )

    const activeUsers = useMemo(() => {
        return users.filter(t => t.status === STATUS.ACTIVE)
    }, [users])

    useEffect(() => {
        if (!isFetched) {
            refetchUsers()
            setIsFetched(true)
        }
    }, [setUsers, isFetched, setIsFetched, refetchUsers])

    return {
        users,
        setUsers,
        activeUsers,
        refetchUsers,
    } as const
}
