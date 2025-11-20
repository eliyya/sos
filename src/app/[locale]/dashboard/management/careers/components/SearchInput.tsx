'use client'

import { Search } from 'lucide-react'
import { SimpleInput } from '@/components/Inputs'
import LabeledSwitch from '@/components/Switch'
import { useTranslations } from 'next-intl'
import { useQueryParam } from '@/hooks/query.hooks'

export function Filters() {
    const [query, setQuery] = useQueryParam('q', '')
    const [archived, setArchived] = useQueryParam('archived', false)
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
                    onCheckedChange={() => setArchived(prv => !prv)}
                />
            </div>
        </div>
    )
}
