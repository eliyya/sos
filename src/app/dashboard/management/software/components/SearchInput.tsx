'use client'

import { SimpleInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import { Search } from 'lucide-react'
import { queryAtom } from '@/global/managment-software'

export function Filters() {
    const [query, setQuery] = useAtom(queryAtom)

    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                <SimpleInput
                    placeholder='Buscar software...'
                    className='pl-8'
                    value={query}
                    onChange={e => setQuery(e.currentTarget.value)}
                />
            </div>
        </div>
    )
}
