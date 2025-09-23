import { getRoles } from '@/actions/roles.actions'
import { rolesAtom } from '@/global/roles.globals'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const isRolesFetchedAtom = atom(false)

export function useRoles() {
    const [roles, setRoles] = useAtom(rolesAtom)
    const [isFetched, setIsFetched] = useAtom(isRolesFetchedAtom)

    const refetchRoles = useCallback(
        () =>
            getRoles().then(roles =>
                setRoles(
                    roles.map(role => ({
                        ...role,
                        permissions: role.permissions.toString(),
                    })),
                ),
            ),
        [setRoles],
    )

    useEffect(() => {
        if (!isFetched) {
            refetchRoles()
            setIsFetched(true)
        }
    }, [setRoles, isFetched, setIsFetched, refetchRoles])

    return { roles, setRoles, refetchRoles } as const
}
