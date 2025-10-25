'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { openDialogAtom } from '@/global/subjects.globals'

export function CreateButton() {
    const openCreateUser = useSetAtom(openDialogAtom)

    return (
        <Button onClick={() => openCreateUser('CREATE')}>
            <Plus className='mr-3' />
            Crear Materia
        </Button>
    )
}
