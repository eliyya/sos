'use client'

import { User, STATUS } from '@/prisma/generated/browser'
import { useSetAtom } from 'jotai'
import {
    Archive,
    ArchiveRestore,
    ChevronLeftIcon,
    ChevronRightIcon,
    Pencil,
    Trash2,
} from 'lucide-react'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { TableRow, TableCell } from '@/components/Table'
import { selectedIdAtom, dialogAtom } from '@/global/management.globals'
import { SearchUsersPromise } from '@/hooks/users.hooks'
import { SearchUsersContext } from '@/contexts/users.context'
import { use } from 'react'

interface StudentItemListProps {
    user: Awaited<SearchUsersPromise>['users'][number]
}
export function UserItem({ user }: StudentItemListProps) {
    return (
        <TableRow>
            <TableCell>@{user.username}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>
                <Badge variant='outline'>{user.role.name}</Badge>
            </TableCell>
            <TableCell className='flex gap-1'>
                <Buttons user={user} />
            </TableCell>
        </TableRow>
    )
}

interface ButtonsProps {
    user: User
}
function Buttons({ user }: ButtonsProps) {
    const setDialogOpened = useSetAtom(dialogAtom)
    const setUserSelected = useSetAtom(selectedIdAtom)
    if (user.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('EDIT')
                        setUserSelected(user.id)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('ARCHIVE')
                        setUserSelected(user.id)
                    }}
                >
                    <Archive className='w-xs text-xs' />
                </Button>
            </>
        )
    if (user.status === STATUS.ARCHIVED)
        return (
            <>
                {/* Unarchive */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('UNARCHIVE')
                        setUserSelected(user.id)
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('DELETE')
                        setUserSelected(user.id)
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}

export function UsersList() {
    const { usersPromise } = use(SearchUsersContext)
    const { users } = use(usersPromise)

    if (!users.length)
        return (
            <TableRow>
                <TableCell className='text-center' colSpan={5}>
                    No se encontraron resultados
                </TableCell>
            </TableRow>
        )

    return users.map(entity => <UserItem key={entity.id} user={entity} />)
}

export function FoooterTable() {
    const { changeFilters, filters, usersPromise } = use(SearchUsersContext)
    const { pages } = use(usersPromise)

    return (
        <div className='flex items-center justify-center gap-5'>
            <Button
                variant='outline'
                size='sm'
                onClick={() =>
                    changeFilters({
                        page: filters.page - 1,
                    })
                }
                disabled={filters.page === 1}
            >
                <ChevronLeftIcon className='h-4 w-4' />
                Anterior
            </Button>
            <div className='text-sm font-medium'>
                Página {filters.page} de {pages}
            </div>
            <Button
                variant='outline'
                size='sm'
                onClick={() =>
                    changeFilters({
                        page: filters.page + 1,
                    })
                }
                disabled={filters.page === pages}
            >
                Siguiente
                <ChevronRightIcon className='h-4 w-4' />
            </Button>
        </div>
    )
}
