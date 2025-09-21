import { managementRouteSelected } from '@/global/routes.globals'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { BeakerIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ManagementLink() {
    const pathname = usePathname().replace(/\/$/, '')
    const [route, setRoute] = useAtom(managementRouteSelected)

    useEffect(() => {
        if (pathname.includes('/dashboard/management')) setRoute(pathname)
    }, [pathname, setRoute])

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
