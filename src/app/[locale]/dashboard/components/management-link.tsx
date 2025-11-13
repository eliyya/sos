import {
    PERMISSIONS_FLAGS,
    PermissionsBitField,
} from '@/bitfields/PermissionsBitField'
import { managementRouteSelected } from '@/global/management.globals'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { BeakerIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ManagementLink() {
    const pathname = usePathname().replace(/\/$/, '')
    const [route, setRoute] = useAtom(managementRouteSelected)
    const { data: session } = authClient.useSession()
    const permissions =
        session ?
            new PermissionsBitField(session.user.permissions)
        :   new PermissionsBitField()

    useEffect(() => {
        if (pathname.includes('/dashboard/management')) setRoute(pathname)
    }, [pathname, setRoute])

    if (
        !permissions.any(
            PERMISSIONS_FLAGS.MANAGE_LABS |
                PERMISSIONS_FLAGS.MANAGE_USERS |
                PERMISSIONS_FLAGS.MANAGE_ROLES |
                PERMISSIONS_FLAGS.MANAGE_SUBJECTS |
                PERMISSIONS_FLAGS.MANAGE_CAREERS |
                PERMISSIONS_FLAGS.MANAGE_CLASSES |
                PERMISSIONS_FLAGS.MANAGE_STUDENTS |
                PERMISSIONS_FLAGS.MANAGE_MACHINES |
                PERMISSIONS_FLAGS.MANAGE_SOFTWARE,
        )
    )
        return null

    return (
        <Link
            href={route}
            className={cn(
                'hover:bg-accent text-muted-foreground flex items-center gap-3 rounded-md px-4 py-2 text-sm',
                {
                    'bg-accent text-accent-foreground font-medium':
                        pathname.includes('/dashboard/management'),
                },
            )}
        >
            <BeakerIcon className='h-4 w-4' />
            Gestion
        </Link>
    )
}
