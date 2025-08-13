import { TriangleIcon } from 'lucide-react'
import { CompletSelect } from '@/components/Select'
import { Role } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getRoles } from '@/actions/roles'

export function RoleSelect() {
    const [roles, setRoles] = useState<Role[]>([])

    useEffect(() => {
        getRoles().then(setRoles)
    }, [])

    return (
        <CompletSelect
            required
            label='Rol'
            name='role_id'
            options={roles.map(r => ({
                label: r.name,
                value: r.id,
            }))}
            icon={TriangleIcon}
        />
    )
}
