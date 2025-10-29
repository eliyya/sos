'use client'

import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    Table,
} from '@/components/Table'
import { ArchiveDialog } from './ArchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { EditDialog } from './EditDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { UnarchiveOrDeleteDialog } from './UnarchiveOrDeleteDialog'
import { useCareers } from '@/hooks/careers.hooks'
import { use } from 'react'
import { StudentItemList } from './StudentItemList'
import { SearchStudentsContext } from '@/contexts/students.context'

export function EntityTable() {
    const { studentsPromise } = use(SearchStudentsContext)
    const { careers } = useCareers()
    const students = use(studentsPromise)

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Semestre</TableHead>
                        <TableHead>Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map(entity => (
                        <StudentItemList
                            key={entity.nc}
                            student={entity}
                            careers={careers}
                        />
                    ))}
                </TableBody>
            </Table>
            <EditDialog />
            <ArchiveDialog />
            <UnarchiveDialog />
            <DeleteDialog />
            <UnarchiveOrDeleteDialog />
        </>
    )
}
