'use client'

import { useAtom } from 'jotai'
import { CheckCheckIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { dialogOpenedAtom } from '@/global/users.globals'

export function PreventArchiveAdminDialog() {
    const [open, setOpen] = useAtom(dialogOpenedAtom)

    return (
        <Dialog
            open={open === 'preventArchiveAdmin'}
            onOpenChange={op => setOpen(op ? 'preventArchiveAdmin' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Parece que olvidaste algo</DialogTitle>
                    <DialogDescription>
                        Eres el único admin, no puedes dejar la aplicación sin
                        administradores
                    </DialogDescription>
                </DialogHeader>
                <span>
                    Intenta dejarle la batuta a alguien más creando antes otro
                    administrador
                </span>
                <form
                    action={() => setOpen(null)}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button type='submit'>
                            <CheckCheckIcon className='mr-2 h-5 w-5' />
                            Entendido
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
