'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dialogAtom } from '@/global/management.globals'

export function CreateButton() {
    const openDialog = useSetAtom(dialogAtom)

    return (
        <Button onClick={() => openDialog('CREATE')}>
            <Plus className='mr-3' />
            Crear Estudiante
        </Button>
    )
}
