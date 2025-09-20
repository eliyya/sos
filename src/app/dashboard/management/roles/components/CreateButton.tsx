'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { useTransition } from 'react'

import { createNewRole } from '@/actions/roles'
import { Button } from '@/components/Button'
import { rolesAtom, selectedRoleIdAtom } from '@/global/management-roles'

export function CreateButton() {
    // const openCreateUser = useSetAtom(openCreateAtom)
    const setRoles = useSetAtom(rolesAtom)
    const [inTransition, startTransition] = useTransition()
    const setSelectedRoleId = useSetAtom(selectedRoleIdAtom)

    const onClick = async () =>
        startTransition(async () => {
            const response = await createNewRole()
            if (response.status === 'success') {
                setRoles(prev => [
                    ...prev,
                    {
                        id: response.role.id,
                        name: response.role.name,
                        permissions: response.role.permissions.toString(),
                    },
                ])
                setSelectedRoleId(response.role.id)
            } else console.log(response)
        })

    return (
        <Button onClick={() => onClick()} disabled={inTransition}>
            <Plus className='mr-3' />
            Crear Rol
        </Button>
    )
}
