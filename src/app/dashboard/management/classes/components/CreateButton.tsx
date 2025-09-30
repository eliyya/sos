'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { openCreateAtom } from '@/global/management-class'
import { useTranslations } from 'next-intl'

export function CreateButton() {
    const openCreateUser = useSetAtom(openCreateAtom)
    const t = useTranslations('classes')

    return (
        <Button onClick={() => openCreateUser(true)}>
            <Plus className='mr-3' />
            {t('create_class')}
        </Button>
    )
}
