'use client'

import { EditingContext, RESET_VALUE } from '@/contexts/edited.context'
import {
    Activity,
    ChangeEvent,
    createContext,
    JSX,
    Suspense,
    use,
    useCallback,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './Table'
import { RetornableInput } from './Inputs'
import { Button, Skeleton } from '@mantine/core'
import { SearchContext, SearchEntity } from '@/hooks/search.hooks'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { ChangeProps } from '@/lib/utils'
import {
    editCareer,
    archiveCareer,
    unarchiveCareer,
    deleteCareer,
} from '@/actions/careers.actions'
import {
    editClass,
    archiveClass,
    unarchiveClass,
    deleteClass,
} from '@/actions/classes.actions'
import {
    editLaboratory,
    archiveLaboratory,
    unarchiveLaboratory,
    deleteLaboratory,
} from '@/actions/laboratories.actions'
import {
    editMachine,
    maintainanceMachine,
    availableMachine,
    deleteMachine,
} from '@/actions/machines.actions'
import {
    editStudent,
    archiveStudent,
    unarchiveStudent,
    deleteStudent,
} from '@/actions/students.actions'
import {
    editSubject,
    archiveSubject,
    unarchiveSubject,
    deleteSubject,
} from '@/actions/subjects.actions'
import {
    editUserAction,
    archiveUserAction,
    unarchiveUserAction,
    deleteUserAction,
} from '@/actions/users.actions'
import { Career } from '@/prisma/generated/client'

interface EditableCellProps {
    name: string
    id: string
    defaultValue: string
}
export function EditableCell({ name, defaultValue, id }: EditableCellProps) {
    const { setEditing, resetSignal } = use(EditingContext)
    const [editingCell, setEditingCell] = useState(false)
    const [isEdited, setEdited] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditingCell(false)
        setEdited(false)
    }, [resetSignal])

    const onEdited = (edited: boolean, e: ChangeEvent<HTMLInputElement>) => {
        if (edited) setEditing(id, e.target.value)
        else setEditing(id, RESET_VALUE)
        setEdited(edited)
    }

    return (
        <TableCell onDoubleClick={() => setEditingCell(true)}>
            {editingCell || isEdited ?
                <RetornableInput
                    resetSignal={resetSignal}
                    id={id}
                    autoFocus
                    name={name}
                    defaultValue={defaultValue}
                    onEdited={onEdited}
                    onBlur={() => setEditingCell(false)}
                />
            :   defaultValue}
        </TableCell>
    )
}

interface SelectCellProps {
    id: string
}
export function SelectCell({ id }: SelectCellProps) {
    const { select, resetSignal, selectSignal, deselectSignal } =
        use(EditingContext)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecked(false)
    }, [resetSignal])

    useEffect(() => {
        select(id, true)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecked(true)
    }, [id, select, selectSignal])

    useEffect(() => {
        select(id, false)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecked(false)
    }, [deselectSignal, id, select])

    return (
        <TableCell>
            <input
                type='checkbox'
                checked={checked}
                onChange={e => {
                    setChecked(e.target.checked)
                    select(id, e.target.checked)
                }}
            />
        </TableCell>
    )
}

export function SelectAllCell() {
    const { selectAll, deselectAll, resetSignal } = use(EditingContext)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecked(false)
    }, [resetSignal])

    return (
        <TableCell>
            <input
                type='checkbox'
                checked={checked}
                onChange={e => {
                    setChecked(e.target.checked)
                    if (e.target.checked) selectAll()
                    else deselectAll()
                }}
            />
        </TableCell>
    )
}

interface PassContextProps<E extends SearchEntity> {
    context: ReturnType<
        typeof createContext<
            SearchContext<
                E,
                () => {
                    filters: { page: number; archived: boolean }
                    changeFilters: (
                        props: ChangeProps<{ page: number }>,
                    ) => void
                }
            >
        >
    >
}
export function ContextedFooterTable<E extends SearchEntity>({
    context,
}: PassContextProps<E>) {
    const { changeFilters, filters, promise } = use(context)
    const { pages } = use(promise as Promise<{ pages: number }>)

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

function FoooterTableSkeleton() {
    return (
        <div className='flex items-center justify-center gap-5'>
            <Button variant='outline' size='sm' disabled={true}>
                <ChevronLeftIcon className='h-4 w-4' />
                Anterior
            </Button>
            <Skeleton>
                <div className='text-sm font-medium'>Página 1 de 1</div>
            </Skeleton>
            <Button variant='outline' size='sm' disabled={true}>
                Siguiente
                <ChevronRightIcon className='h-4 w-4' />
            </Button>
        </div>
    )
}

export function FoooterTable<E extends SearchEntity>({
    context,
}: PassContextProps<E>) {
    return (
        <Suspense fallback={<FoooterTableSkeleton />}>
            <ContextedFooterTable context={context} />
        </Suspense>
    )
}

interface TableHeadSkeletonProps {
    columns: number
}
export function TableHeadSkeleton({ columns }: TableHeadSkeletonProps) {
    return (
        <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                    <Skeleton>Lorem</Skeleton>
                </TableHead>
            ))}
        </TableRow>
    )
}

interface GenericTableProps<
    E extends SearchEntity,
> extends PassContextProps<E> {
    headers: string[]
    list(): JSX.Element | JSX.Element[]
}
export function GenericTable<E extends SearchEntity>({
    context,
    headers,
    list: List,
}: GenericTableProps<E>) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SelectAllCell />
                        {headers.map((header, i) => (
                            <TableHead key={i}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <Suspense
                        fallback={
                            <TableHeadSkeleton columns={headers.length + 1} />
                        }
                    >
                        <List />
                    </Suspense>
                </TableBody>
            </Table>
            <FoooterTable context={context} />
        </>
    )
}

const ACTIONS: Record<
    SearchEntity,
    {
        edit(props: { id: string } & Record<string, unknown>): Promise<unknown>
        archive(id: string): Promise<unknown>
        unarchive(id: string): Promise<unknown>
        delete(id: string): Promise<unknown>
    }
> = {
    careers: {
        edit: editCareer,
        archive: archiveCareer,
        unarchive: unarchiveCareer,
        delete: deleteCareer,
    },
    classes: {
        edit: editClass,
        archive: archiveClass,
        unarchive: unarchiveClass,
        delete: deleteClass,
    },
    laboratories: {
        edit: editLaboratory,
        archive: archiveLaboratory,
        unarchive: unarchiveLaboratory,
        delete: deleteLaboratory,
    },
    machines: {
        edit: editMachine,
        archive: maintainanceMachine,
        unarchive: availableMachine,
        delete: deleteMachine,
    },
    students: {
        edit: (props: { id: string } & Record<string, unknown>) =>
            editStudent({ nc: props.id }),
        archive: archiveStudent,
        unarchive: unarchiveStudent,
        delete: deleteStudent,
    },
    subjects: {
        edit: editSubject,
        archive: archiveSubject,
        unarchive: unarchiveSubject,
        delete: deleteSubject,
    },
    users: {
        edit: editUserAction,
        archive: archiveUserAction,
        unarchive: unarchiveUserAction,
        delete: deleteUserAction,
    },
}
interface ActionsProps<E extends SearchEntity> extends PassContextProps<E> {
    entity: E
}
export function TableActions<E extends SearchEntity>({
    entity,
    context,
}: ActionsProps<E>) {
    const { editing, cancell, selected } = use(EditingContext)
    const [inTransition, startTransition] = useTransition()
    const { refresh, filters } = use(context)
    const actions = useMemo(() => ACTIONS[entity], [entity])

    const onSave = useCallback(
        () =>
            startTransition(async () => {
                const edited = new Map<string, Partial<Career>>()
                for (const [k, v] of editing) {
                    const [id, field] = k.split('-')
                    const prev: Partial<Career> = edited.get(id) ?? {}
                    Object.assign(prev, { [field]: v })
                    edited.set(id, prev)
                }
                for (const [id, career] of edited) {
                    await actions.edit({ id, ...career })
                }
                refresh()
                cancell()
            }),
        [refresh, cancell, editing, actions],
    )

    const onCancell = useCallback(
        () =>
            startTransition(async () => {
                cancell()
            }),
        [cancell],
    )

    const onArchive = useCallback(
        () =>
            startTransition(async () => {
                for (const id of selected) await actions.archive(id)
                refresh()
                cancell()
            }),
        [refresh, cancell, selected, actions],
    )

    const onUnarchive = useCallback(
        () =>
            startTransition(async () => {
                for (const id of selected) await actions.unarchive(id)
                refresh()
                cancell()
            }),
        [refresh, cancell, selected, actions],
    )

    const onDelete = useCallback(
        () =>
            startTransition(async () => {
                for (const id of selected) await actions.delete(id)
                refresh()
                cancell()
            }),
        [refresh, cancell, selected, actions],
    )

    return (
        <div className='flex gap-2'>
            <Activity mode={filters.archived ? 'hidden' : 'visible'}>
                {/* normal */}
                <Button
                    variant={'default'}
                    size={'sm'}
                    disabled={inTransition || editing.size === 0}
                    onClick={onSave}
                >
                    Save
                </Button>
                <Button
                    variant={'destructive'}
                    size={'sm'}
                    disabled={inTransition || selected.size === 0}
                    onClick={onArchive}
                >
                    Archive
                </Button>
            </Activity>
            <Activity mode={filters.archived ? 'visible' : 'hidden'}>
                {/* archived */}
                <Button
                    variant={'default'}
                    size={'sm'}
                    disabled={inTransition || selected.size === 0}
                    onClick={onUnarchive}
                >
                    Unarchive
                </Button>
                <Button
                    variant={'destructive'}
                    size={'sm'}
                    disabled={inTransition || selected.size === 0}
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </Activity>
            <Button
                variant={'outline'}
                size={'sm'}
                disabled={
                    (inTransition || editing.size === 0) && selected.size === 0
                }
                onClick={onCancell}
            >
                Cancel
            </Button>
        </div>
    )
}
