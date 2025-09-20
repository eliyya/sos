'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'

import { Button } from '@/components/Button'
import { openCreateAtom } from '@/global/management-laboratory'

export function CreateButton() {
    const openCreateUser = useSetAtom(openCreateAtom)

    return (
        <Button onClick={() => openCreateUser(true)}>
            <Plus className='mr-3' />
            Crear Laboratorio
        </Button>
    )
}
