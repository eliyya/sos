import {
    Toast as ToastComponent,
    ToastDescription,
    ToastTitle,
} from '@/components/Toast'
import { useCallback, useState } from 'react'

export function useToast() {
    const [toastInfo, setToast] = useState<{
        title: string
        description?: string
        variant?: 'destructive' | 'default'
    } | null>(null)

    const openToast = useCallback(
        (
            info: {
                title: string
                description: string
                variant?: 'destructive' | 'default'
            } | null,
        ) => {
            setToast(info)
        },
        [setToast],
    )

    const Toast = () => (
        <ToastComponent
            variant={toastInfo?.variant || 'default'}
            open={toastInfo !== null}
            onOpenChange={v => {
                if (!v) openToast(null)
            }}
        >
            <ToastTitle>{toastInfo?.title}</ToastTitle>
            <ToastDescription>{toastInfo?.description}</ToastDescription>
        </ToastComponent>
    )

    return { openToast, Toast } as const
}
