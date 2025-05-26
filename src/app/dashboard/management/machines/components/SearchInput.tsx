'use client'

import { SimpleInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import { queryAtom, showArchivedAtom } from '@/global/managment-machines'
import ToggleSwitch from '@/components/Switch'

export function Filters() {
    const [query, setQuery] = useAtom(queryAtom)
    const [archived, setArchived] = useAtom(showArchivedAtom)

    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <SimpleInput
                    placeholder='Buscar software...'
                    className='pl-8'
                    value={query}
                    onChange={e => setQuery(e.currentTarget.value)}
                />
            </div>
            <div>
                <ToggleSwitch
                    label='Archivados'
                    checked={archived}
                    onCheckedChange={() => setArchived(v => !v)}
                />
            </div>
        </div>
    )
}
