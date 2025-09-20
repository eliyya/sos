'use client'

import { SimpleInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import { queryAtom, showArchivedAtom } from '@/global/management-users'
import LabeledSwitch from '@/components/Switch'

export function Filters() {
    const [query, setQuery] = useAtom(queryAtom)
    const [archived, setArchived] = useAtom(showArchivedAtom)

    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <SimpleInput
                    placeholder='Search users...'
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
