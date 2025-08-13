import { TriangleIcon } from 'lucide-react'
import { RetornableCompletSelect } from '@/components/Select'
import { useAtomValue } from 'jotai'
import { userToEditAtom } from '@/global/management-users'
import { useEffect, useState } from 'react'
import { getRoles } from '@/actions/roles'
import { Role } from '@prisma/client'

interface EditRoleSelectProps {
    className?: string
}

export function EditRoleSelect({ className }: EditRoleSelectProps) {
    const oldUser = useAtomValue(userToEditAtom)
    const [roles, setRoles] = useState<Role[]>([])

    useEffect(() => {
        getRoles().then(setRoles)
    }, [])

    if (!oldUser) return null

    return (
        <RetornableCompletSelect
            label='Rol'
            name='role_id'
            originalValue={{
                label: roles.find(r => r.id === oldUser.role_id)?.name ?? oldUser.role_id,
                value: oldUser.role_id,
            }}
            options={roles.map(r => ({
                label: r.name,
                value: r.id,
            }))}
            icon={TriangleIcon}
            className={className}
        />
    )
}
