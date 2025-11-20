'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { dialogAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'

export function CreateButton() {
    const openDialog = useSetAtom(dialogAtom)
    const t = useTranslations('classes')

    return (
        <Button onClick={() => openDialog('CREATE')}>
            <Plus className='mr-3' />
            {t('create_class')}
        </Button>
    )
}
