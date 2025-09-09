'use client'

import { SimpleInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import { queryAtom, showArchivedAtom } from '@/global/management-machines'
import ToggleSwitch from '@/components/Switch'
import { Search } from 'lucide-react'

export function Filters() {
    const [query, setQuery] = useAtom(queryAtom)
    const [archived, setArchived] = useAtom(showArchivedAtom)

    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <SimpleInput
                    placeholder='Buscar maquina...'
                    className='pl-10'
                    value={query}
                    onChange={e => setQuery(e.currentTarget.value)}
                />
                <Search className='absolute top-1/2 left-3 -translate-y-1/2' />
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
