'use client'

import { TableRow, TableCell } from '@/components/Table'
import { use } from 'react'
import { SearchCareersContext } from '@/contexts/careers.context'
import { SearchCareersPromise } from '@/hooks/search.hooks'
import { EditableCell, SelectCell } from '@/components/editable-cell'

export function CareersList() {
    const { promise } = use(SearchCareersContext)
    const { careers } = use(promise)

    if (!careers.length)
        return (
            <TableRow>
                <TableCell className='text-center' colSpan={5}>
                    No se encontraron resultados
                </TableCell>
            </TableRow>
        )

    return careers.map(career => <CareerItem key={career.id} career={career} />)
}

interface CareerItemListProps {
    career: Awaited<SearchCareersPromise>['careers'][number]
}
export function CareerItem({ career }: CareerItemListProps) {
    return (
        <TableRow>
            <SelectCell id={career.id} />
            <EditableCell
                name={career.name}
                defaultValue={career.name}
                id={`${career.id}-name`}
            />
            <EditableCell
                name={career.alias}
                defaultValue={career.alias}
                id={`${career.id}-alias`}
            />
        </TableRow>
    )
}
