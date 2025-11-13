'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { dialogAtom } from '@/global/management.globals'

export function CreateButton() {
    const openCreateUser = useSetAtom(dialogAtom)

    return (
        <Button onClick={() => openCreateUser('CREATE')}>
            <Plus className='mr-3' />
            Crear Usuario
        </Button>
    )
}
