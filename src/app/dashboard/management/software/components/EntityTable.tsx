'use client'

import { Software } from '@/prisma/browser'
import { useAtomValue, useSetAtom } from 'jotai'
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSoftware } from '@/actions/software'
import { Button } from '@/components/Button'
import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Table,
} from '@/components/Table'
import {
    editDialogAtom,
    openDeleteAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-software'
import { DeleteDialog } from './DeleteDialog'
import { EditDialog } from './EditDialog'

export function EntityTable() {
    const [entity, setEntity] = useState<Software[]>([])
    const update = useAtomValue(updateAtom)

    useEffect(() => {
        getSoftware().then(setEntity)
    }, [update])

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entity.map(entity => (
                        <TableRow key={entity.id}>
                            <TableCell>{entity.name}</TableCell>
                            <TableCell className='flex gap-1'>
                                <Buttons entity={entity} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditDialog />
            <DeleteDialog />
        </>
    )
}
interface ButtonsProps {
    entity: Software
}
function Buttons({ entity }: ButtonsProps) {
    const openEditDialog = useSetAtom(editDialogAtom)
    const setSubjectSelected = useSetAtom(entityToEditAtom)
    const openDeleteDialog = useSetAtom(openDeleteAtom)
    return (
        <>
            {/* Editar */}
            <Button
                size='icon'
                onClick={() => {
                    openEditDialog(true)
                    setSubjectSelected(entity)
                }}
            >
                <Pencil className='text-xs' />
            </Button>
            {/* Delete */}
            <Button
                size='icon'
                onClick={() => {
                    setSubjectSelected(entity)
                    openDeleteDialog(true)
                }}
            >
                <Trash2 className='w-xs text-xs' />
            </Button>
        </>
    )
}
