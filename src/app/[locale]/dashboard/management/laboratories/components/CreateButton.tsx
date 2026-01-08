'use client'

import { useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dialogAtom } from '@/global/management.globals'
import { CreateLaboratoryDialog } from './CreateDialog'

export function CreateButton() {
    const t = useTranslations('laboratories')
    const openDialog = useSetAtom(dialogAtom)

    return (
        <>
            <CreateLaboratoryDialog />
            <Button onClick={() => openDialog('CREATE')}>
                <Plus className='mr-3' />
                {t('create_button')}
            </Button>
        </>
    )
}
