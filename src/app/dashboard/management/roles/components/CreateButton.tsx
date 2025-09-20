'use client'

import { Plus } from 'lucide-react'

import { Button } from '@/components/Button'

export function CreateButton() {
    // const openCreateUser = useSetAtom(openCreateAtom)

    return (
        <Button onClick={() => {}}>
            <Plus className='mr-3' />
            Crear Rol
        </Button>
    )
}
