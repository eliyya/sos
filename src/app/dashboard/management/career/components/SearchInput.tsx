'use client'

import { SimpleInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import { Search } from 'lucide-react'
import { queryAtom, showArchivedAtom } from '@/global/managment-career'
import ToggleSwitch from '@/components/Switch'

export function Filters() {
    const [query, setQuery] = useAtom(queryAtom)
    const [archived, setArchived] = useAtom(showArchivedAtom)

    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <SimpleInput
                    placeholder='Buscar carrera...'
                    className='pl-8'
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
