'use client'

import { Button } from '@/components/Button'
import { Plus } from 'lucide-react'

export function CreateButton() {
    // const openCreateUser = useSetAtom(openCreateAtom)

    return (
        <Button onClick={() => {}}>
            <Plus className='mr-3' />
            Crear Rol
        </Button>
    )
}
