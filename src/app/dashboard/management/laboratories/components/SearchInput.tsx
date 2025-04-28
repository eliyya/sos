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
                <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                <SimpleInput
                    placeholder='Buscar carrera...'
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
