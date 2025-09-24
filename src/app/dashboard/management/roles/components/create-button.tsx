'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { useTransition } from 'react'
import { createNewRole } from '@/actions/roles.actions'
import { Button } from '@/components/Button'
import { selectedRoleIdAtom } from '@/global/roles.globals'
import { useRoles } from '@/hooks/roles.hooks'

export function CreateButton() {
    const { setRoles } = useRoles()
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
