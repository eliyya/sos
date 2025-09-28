'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { dialogOpenedAtom } from '@/global/users.globals'

export function CreateButton() {
    const openCreateUser = useSetAtom(dialogOpenedAtom)

    return (
        <Button onClick={() => openCreateUser('create')}>
            <Plus className='mr-3' />
            Crear Usuario
        </Button>
    )
}
