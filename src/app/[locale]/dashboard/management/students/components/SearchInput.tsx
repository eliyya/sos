'use client'

import { CornerDownLeftIcon, SearchIcon } from 'lucide-react'
import { SimpleInput } from '@/components/Inputs'
import { LabeledSwitch } from '@/components/ui/switch'
import { FormEvent, use, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { SearchStudentsContext } from '@/contexts/students.context'

export function Filters() {
    const { changeFilters, filters } = use(SearchStudentsContext)
    const queryInputRef = useRef<HTMLInputElement>(null)

    const onSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const query = queryInputRef.current?.value.trim() || ''
            changeFilters({ query })
        },
        [queryInputRef, changeFilters],
    )

    useEffect(() => {
        if (queryInputRef.current) queryInputRef.current.value = filters.query
    }, [filters.query, queryInputRef])

    return (
        <form className='flex items-center' onSubmit={onSubmit}>
            <div className='relative flex-1 flex-row'>
                <SimpleInput
                    placeholder='Buscar estudiante...'
                    ref={queryInputRef}
                    className='rounded-r-none pl-10'
                />
                <SearchIcon className='absolute top-1/2 left-3 -translate-y-1/2' />
            </div>
            <Button
                type='submit'
                variant='secondary'
                size='icon'
                className='rounded-l-none'
            >
                <CornerDownLeftIcon />
            </Button>
            <div className='ml-4'>
                <LabeledSwitch
                    label='Archivados'
                    checked={filters.archived}
                    onCheckedChange={archived => changeFilters({ archived })}
                />
            </div>
        </form>
    )
}
