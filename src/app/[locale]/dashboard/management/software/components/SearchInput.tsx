'use client'

import { useAtom } from 'jotai'
import { SimpleInput } from '@/components/Inputs'
import { queryAtom } from '@/global/managment-software'

export function Filters() {
    const [query, setQuery] = useAtom(queryAtom)

    return (
        <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
                <SimpleInput
                    placeholder='Buscar software...'
                    className='pl-10'
                    value={query}
                    onChange={e => setQuery(e.currentTarget.value)}
                />
            </div>
        </div>
    )
}
