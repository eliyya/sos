import { Dialog, DialogContent } from '@/components/Dialog'
import { useEffect, useState } from 'react'
import { Practice } from '@prisma/client'
import { useAtom } from 'jotai'
import { practiceSelectedAtom } from '../globals'

export function InfoDialog() {
    const [prom, setProm] = useState<Promise<Practice | null>>(
        Promise.resolve(null),
    )
    const [practiceSelected, setPracticeSelected] =
        useAtom(practiceSelectedAtom)

    useEffect(() => {
        if (practiceSelected) setProm()
    }, [practiceSelected])
    return (
        <Dialog>
            <DialogContent></DialogContent>
        </Dialog>
    )
}
