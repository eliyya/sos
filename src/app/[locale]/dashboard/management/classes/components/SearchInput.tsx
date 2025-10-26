'use client'

import { Search } from 'lucide-react'
import { SimpleInput } from '@/components/Inputs'
import LabeledSwitch from '@/components/Switch'
import { useTranslations } from 'next-intl'
import { useQueryParam } from '@/hooks/query.hooks'

export function Filters() {
    const [query, setQuery] = useQueryParam('q', '')
    const [archived, setArchived] = useQueryParam('archived', false)
    const t = useTranslations('classes')
    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <Search className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                <SimpleInput
                    placeholder={t('search_class')}
                    className='pl-10'
                    value={query}
                    onChange={e => setQuery(e.currentTarget.value)}
                />
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
