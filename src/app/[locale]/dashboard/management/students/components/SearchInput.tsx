'use client'

import { CornerDownLeftIcon, Search } from 'lucide-react'
import { SimpleInput } from '@/components/Inputs'
import LabeledSwitch from '@/components/Switch'
import { useQueryParam } from '@/hooks/query.hooks'
import { FormEvent, useCallback } from 'react'
import { Button } from '@/components/Button'

export function Filters() {
    const [, setQuery] = useQueryParam('q', '')
    const [archived, setArchived] = useQueryParam('archived', false)

    const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const q = formData.get('q') as string
        setQuery(q.trim())
    }, [])

    return (
        <form className='flex items-center' onSubmit={onSubmit}>
            <div className='relative flex-1 flex-row'>
                <SimpleInput
                    placeholder='Buscar estudiante...'
                    name='q'
                    className='rounded-r-none pl-10'
                />
                <Search className='absolute top-1/2 left-3 -translate-y-1/2' />
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
                    checked={archived}
                    onCheckedChange={() => setArchived(v => !v)}
                />
            </div>
        </form>
    )
}
