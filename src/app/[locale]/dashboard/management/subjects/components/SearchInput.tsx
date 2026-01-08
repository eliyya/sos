'use client'

import { Search } from 'lucide-react'
import { SimpleInput } from '@/components/Inputs'
import { LabeledSwitch } from '@/components/ui/switch'
import { FormEvent, use, useCallback, useEffect, useRef } from 'react'
import { SearchSubjectsContext } from '@/contexts/subjects.context'

export function Filters() {
    const { filters, changeFilters } = use(SearchSubjectsContext)
    const queryInputRef = useRef<HTMLInputElement>(null)

    const onSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const query = queryInputRef.current?.value.trim() || ''
            changeFilters({ query })
        },
        [changeFilters],
    )

    useEffect(() => {
        if (queryInputRef.current) queryInputRef.current.value = filters.query
    }, [filters.query])

    return (
        <form className='flex items-center gap-4' onSubmit={onSubmit}>
            <div className='relative flex-1'>
                <Search className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                <SimpleInput
                    placeholder='Buscar materias...'
                    className='pl-10'
                    ref={queryInputRef}
                />
            </div>
            <div>
                <LabeledSwitch
                    label='Archivados'
                    checked={filters.archived}
                    onCheckedChange={archived => changeFilters({ archived })}
                />
            </div>
        </form>
    )
}
