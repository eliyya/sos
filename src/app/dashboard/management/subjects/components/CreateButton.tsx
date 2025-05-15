'use client'

import { Button } from '@/components/Button'
import { openCreateAtom } from '@/global/management-subjects'
import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'

export function CreateButton() {
    const openCreateUser = useSetAtom(openCreateAtom)

    return (
        <Button onClick={() => openCreateUser(true)}>
            <Plus className='mr-3' />
            Crear Materia
        </Button>
    )
}
