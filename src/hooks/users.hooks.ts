import { getUsers } from '@/actions/users.actions'
import { usersAtom } from '@/global/users.globals'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const isUsersFetchedAtom = atom(false)

export function useUsers() {
    const [users, setUsers] = useAtom(usersAtom)
    const [isFetched, setIsFetched] = useAtom(isUsersFetchedAtom)

    const refetchUsers = useCallback(
        () => getUsers().then(setUsers),
        [setUsers],
    )

    useEffect(() => {
        if (!isFetched) {
            refetchUsers()
            setIsFetched(true)
        }
    }, [setUsers, isFetched, setIsFetched, refetchUsers])

    return {
        users,
        setUsers,
        refetchUsers,
    } as const
}
