'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { openDialogAtom } from '@/global/students.globals'

export function CreateButton() {
    const openDialog = useSetAtom(openDialogAtom)

    return (
        <Button onClick={() => openDialog('CREATE')}>
            <Plus className='mr-3' />
            Crear Estudiante
        </Button>
    )
}
