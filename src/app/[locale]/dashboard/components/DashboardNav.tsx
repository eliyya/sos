'use client'

import { useTranslations } from 'next-intl'
import app from '@eliyya/type-routes'
import {
    BeakerIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    // LucideIcon,
    // FileDownIcon,
    // FileSearchIcon,
    // MicroscopeIcon,
    // PcCaseIcon,
    Calendar1Icon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { Accordion, AccordionSection } from '@/components/Accordion'
import { APP_NAME } from '@/constants/client'
import { cn } from '@/lib/utils'
import { ManagementLink } from './management-link'

// const reportNavItems: {
//     title: string
//     href: string
//     icon: LucideIcon
// }[] = [
//     {
//         title: 'De Laboratorio',
//         href: '/dashboard/reports/lab',
//         icon: MicroscopeIcon,
//     },
//     {
//         title: 'De CC',
//         href: '/dashboard/reports/cc',
//         icon: PcCaseIcon,
//     },
//     {
//         title: 'Consultar Datos',
//         href: app.$locale.dashboard.reports.query('es'),
//         icon: FileSearchIcon,
//     },
//     {
//         title: 'Exportar Datos',
//         href: app.$locale.dashboard.export('es'),
//         icon: FileDownIcon,
//     },
// ]

interface DashboardNavProps {
    className?: string
}

export function DashboardNav({ className }: DashboardNavProps) {
    const t = useTranslations('nav')
    const pathname = usePathname().replace(/\/$/, '')

    return (
        <nav
            className={cn(
                'bg-muted/50 flex min-h-screen w-64 flex-col border-r px-4 pt-8',
                className,
            )}
        >
            <Link href={app.$locale.dashboard('es')}>
                <div className='mb-8 flex items-center gap-2 px-4'>
                    <BeakerIcon className='text-primary h-6 w-6' />
                    <span className='text-lg font-semibold'>{APP_NAME}</span>
                </div>
            </Link>

            <div className='flex flex-1 flex-col space-y-2'>
                <Link
                    href={app.$locale.dashboard('es')}
                    className={cn(
                        'hover:bg-accent text-muted-foreground flex items-center gap-3 rounded-md px-4 py-2 text-sm',
                        {
                            'bg-accent text-accent-foreground font-medium':
                                pathname ===
                                app.$locale.dashboard('es').replace(/\/$/, ''),
                        },
                    )}
                >
                    <LayoutDashboardIcon className='h-4 w-4' />
                    {t('dashboard')}
                </Link>
                <Link
                    href={'/schedule'}
                    className='hover:bg-accent text-muted-foreground flex items-center gap-3 rounded-md px-4 py-2 text-sm'
                >
                    <Calendar1Icon className='h-4 w-4' />
                    {t('schedule')}
                </Link>
                <ManagementLink />

                {/* <Accordion defaultValue='item-2' type='single' collapsible>
                    <AccordionSection value='item-2' name='Reportes'>
                        {reportNavItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'hover:bg-accent text-muted-foreground flex items-center gap-3 rounded-md px-4 py-2 text-sm',
                                    {
                                        'bg-accent text-accent-foreground font-medium':
                                            pathname.includes(item.href),
                                    },
                                )}
                            >
                                <item.icon className='h-4 w-4' />
                                {item.title}
                            </Link>
                        ))}
                    </AccordionSection>
                </Accordion> */}

                <div className='mt-auto flex flex-1 flex-col justify-end'>
                    <div className='border-t' />

                    <Link
                        href={app.$locale.auth.logout('es')}
                        prefetch={false}
                        className='text-muted-foreground hover:bg-accent my-4 flex items-center gap-3 rounded-md px-4 py-2 text-sm'
                    >
                        <LogOutIcon className='h-4 w-4' />
                        {t('logout')}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
