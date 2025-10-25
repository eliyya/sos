'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { openDialogAtom } from '@/global/laboratories.globals'
import { CreateLaboratoryDialog } from './CreateDialog'

export function CreateButton() {
    const openDialog = useSetAtom(openDialogAtom)

    return (
        <>
            <CreateLaboratoryDialog />
            <Button onClick={() => openDialog('CREATE')}>
                <Plus className='mr-3' />
                Crear Laboratorio
            </Button>
        </>
    )
}
