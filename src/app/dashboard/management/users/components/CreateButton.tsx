'use client'

import { Button } from '@/components/Button'
import { openCreateUserAtom } from '@/global/management-users'
import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'

export function CreateButton() {
    const openCreateUser = useSetAtom(openCreateUserAtom)

    return (
        <Button onClick={() => openCreateUser(true)}>
            <Plus className='mr-3' />
            Crear Usuario
        </Button>
    )
}
