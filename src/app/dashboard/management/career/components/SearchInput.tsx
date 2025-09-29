'use client'

import { useAtom } from 'jotai'
import { Search } from 'lucide-react'
import { SimpleInput } from '@/components/Inputs'
import LabeledSwitch from '@/components/Switch'
import { queryAtom, showArchivedAtom } from '@/global/management-career'
import { useTranslations } from 'next-intl'

export function Filters() {
    const [query, setQuery] = useAtom(queryAtom)
    const [archived, setArchived] = useAtom(showArchivedAtom)
    const t = useTranslations('career')

    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <SimpleInput
                    placeholder={t('search_career')}
                    className='pl-10'
                    value={query}
                    onChange={e => setQuery(e.currentTarget.value)}
                />
                <Search className='absolute top-1/2 left-3 -translate-y-1/2' />
            </div>
            <div>
                <LabeledSwitch
                    label={t('archived')}
                    checked={archived}
                    onCheckedChange={() => setArchived(v => !v)}
                />
            </div>
        </div>
    )
}
