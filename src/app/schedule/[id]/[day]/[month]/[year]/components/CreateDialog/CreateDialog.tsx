'use client'

import { openCreateAtom } from '@/global/management-practices'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { CalendarDialog } from './CalendarDialog'
import { CreateForm } from './CreateForm'
import { useAtom } from 'jotai'

interface CreateDialogProps {
    users: {
        id: string
        name: string
    }[]
    lab: {
        name: string
        id: string
        /**
         * * The end hour of the laboratory in minutes from 00:00
         */
        close_hour: number
        /**
         * * The start hour of the laboratory in minutes from 00:00
         */
        open_hour: number
    }
    isAdmin?: boolean
    user: {
        id: string
        name: string
    } | null
}
export function CreateDialog({ users, lab, isAdmin, user }: CreateDialogProps) {
    const [open, setOpen] = useAtom(openCreateAtom)

    return (
        <Dialog open={open && !!user} onOpenChange={setOpen}>
            <DialogContent className='w-full max-w-4xl'>
                <DialogTitle className='flex flex-col gap-4'>
                    <span className='w-full text-center text-3xl'>
                        Apartar el laboratorio &quot;{lab.name}&quot;
                    </span>
                </DialogTitle>
                <div className='flex gap-8'>
                    <CreateForm
                        lab={lab}
                        users={users}
                        isAdmin={isAdmin}
                        user={user}
                    />
                    <div className='flex-1/2'>
                        <CalendarDialog lab={lab} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
