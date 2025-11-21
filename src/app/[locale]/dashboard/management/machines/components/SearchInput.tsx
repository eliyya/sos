'use client'

import { CornerDownLeftIcon, SearchIcon } from 'lucide-react'
import { SimpleInput } from '@/components/Inputs'
import LabeledSwitch from '@/components/Switch'
import { FormEvent, use, useCallback, useEffect, useRef } from 'react'
import { SearchMachinesContext } from '@/contexts/machines.context'
import { Button } from '@mantine/core'

export function Filters() {
    const { filters, changeFilters } = use(SearchMachinesContext)
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
                    placeholder='Buscar Maquina...'
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
            <LabeledSwitch
                className='ml-4'
                label='En Mantenimiento'
                checked={filters.maintenance}
                onCheckedChange={maintenance => changeFilters({ maintenance })}
            />
        </form>
    )
}
