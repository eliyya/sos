'use client'

import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/Dialog'
import { openPreventArchiveAdminAtom } from '@/global/management-users'
import { useAtom } from 'jotai'
import { CheckCheckIcon } from 'lucide-react'

export function PreventArchiveAdminDialog() {
    const [open, setOpen] = useAtom(openPreventArchiveAdminAtom)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Parece que olvidaste algo</span>
                </DialogTitle>
                <DialogDescription>
                    Eres el único admin, no puedes dejar la aplicación sin
                    administradores
                </DialogDescription>
                <span>
                    Intenta dejarle la batuta a alguien más creando antes otro
                    administrador
                </span>
                <form
                    action={() => setOpen(false)}
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
