'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner'
import {
    CircleCheckIcon,
    InfoIcon,
    TriangleAlertIcon,
    OctagonXIcon,
    Loader2Icon,
} from 'lucide-react'
import {
    PermissionsBitField,
    PermissionsFlags,
} from '@/bitfields/PermissionsBitField'

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className='toaster group'
            icons={{
                success: <CircleCheckIcon className='size-4' />,
                info: <InfoIcon className='size-4' />,
                warning: <TriangleAlertIcon className='size-4' />,
                error: <OctagonXIcon className='size-4' />,
                loading: <Loader2Icon className='size-4 animate-spin' />,
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'cn-toast',
                },
            }}
            {...props}
        />
    )
}

export { Toaster }

export function toastGenericError() {
    toast.error('Ha ocurrido un error inesperado', {
        description: `Intente mas tarde`,
    })
}

export function toastPermissionError(
    missings: ConstructorParameters<typeof PermissionsBitField>[0],
) {
    toast.error('No tienes permisos suficientes', {
        description: `Necesias ${new PermissionsBitField(missings).toArray().toLocaleString('es-MX')}`,
    })
}
