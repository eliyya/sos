'use client'

import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { openCreateAtom } from '@/global/management-career'
import { useTranslations } from 'next-intl'

export function CreateButton() {
    const openCreateUser = useSetAtom(openCreateAtom)
    const t = useTranslations('career')

    return (
        <Button onClick={() => openCreateUser(true)}>
            <Plus className='mr-3' />
            {t('create_career')}
        </Button>
    )
}
