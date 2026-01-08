'use client'

import { CornerDownLeftIcon, SearchIcon } from 'lucide-react'
import { SimpleInput } from '@/components/Inputs'
import { LabeledSwitch } from '@/components/ui/switch'
import { FormEvent, use, useCallback, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'
import { Button } from '@/components/ui/button'

export function Filters() {
    const t = useTranslations('laboratories')
    const { filters, changeFilters } = use(SearchLaboratoriesContext)
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
        <form className='flex items-center' onSubmit={onSubmit}>
            <div className='relative flex-1 flex-row'>
                <SimpleInput
                    placeholder={t('search_placeholder')}
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
                label={t('archived')}
                checked={filters.archived}
                onCheckedChange={archived => changeFilters({ archived })}
            />
        </form>
    )
}
