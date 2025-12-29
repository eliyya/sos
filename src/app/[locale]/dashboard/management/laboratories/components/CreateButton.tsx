'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dialogAtom } from '@/global/management.globals'
import { CreateLaboratoryDialog } from './CreateDialog'

export function CreateButton() {
    const openDialog = useSetAtom(dialogAtom)

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
