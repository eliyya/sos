'use client'

import { useAtom } from 'jotai'
import { Search } from 'lucide-react'

import { SimpleInput } from '@/components/Inputs'
import LabeledSwitch from '@/components/Switch'
import { queryAtom, showArchivedAtom } from '@/global/management-class'

export function Filters() {
    const [query, setQuery] = useAtom(queryAtom)
    const [archived, setArchived] = useAtom(showArchivedAtom)

    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <Search className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                <SimpleInput
                    placeholder='Buscar clase...'
                    className='pl-10'
                    value={query}
                    onChange={e => setQuery(e.currentTarget.value)}
                />
            </div>
            <div>
                <LabeledSwitch
                    label='Archivados'
                    checked={archived}
                    onCheckedChange={() => setArchived(v => !v)}
                />
            </div>
        </div>
    )
}
