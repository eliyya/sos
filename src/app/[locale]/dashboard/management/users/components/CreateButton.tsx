'use client'

import { useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dialogAtom } from '@/global/management.globals'

export function CreateButton() {
    const t = useTranslations('users')
    const openCreateUser = useSetAtom(dialogAtom)

    return (
        <Button onClick={() => openCreateUser('CREATE')}>
            <Plus className='mr-3' />
            {t('create_button')}
        </Button>
    )
}
