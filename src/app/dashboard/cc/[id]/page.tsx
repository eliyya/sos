import app from '@eliyya/type-routes'
import { AlertCircleIcon, UsersIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Card } from '@/components/Card'
import { db } from '@/prisma/db'
import { DashboardHeader } from '../../components/DashboardHeader'
import { ErrorDialog } from './components/ErrorDialog'
import { RegisterVisitForm } from './components/RegisterVisitForm'
import { VisitsTable } from './components/VisitsTable'

const stats = [
    {
        title: 'Estudiantes',
        value: '45',
        icon: UsersIcon,
        description: 'Visitas registradas',
    },
    {
        title: 'Maquinas',
        value: '3',
        icon: AlertCircleIcon,
        description: 'Maquinas disponibles',
    },
]

interface CCPageProps {
    params: Promise<{
        id: string
    }>
}
export default async function CCPage({ params }: CCPageProps) {
    const { id } = await params
    const cc = await db.laboratory.findUnique({ where: { id } })
    if (!cc) redirect(app.dashboard())
    return (
        <>
            <DashboardHeader heading={`${cc.name}`} text='' />
            <div className='mt-8 grid gap-8'>
                <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
                    {stats.map(stat => (
                        <Card key={stat.title} className='p-6'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-primary/10 rounded-full p-3'>
                                    <stat.icon className='text-primary h-6 w-6' />
                                </div>
                                <div>
                                    <p className='text-muted-foreground text-sm font-medium'>
                                        {stat.title}
                                    </p>
                                    <h3 className='text-2xl font-bold'>
                                        {stat.value}
                                    </h3>
                                    <p className='text-muted-foreground mt-1 text-xs'>
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </section>
                <div className='flex gap-4'>
                    <section className='w-1/3'>
                        <RegisterVisitForm laboratory_id={id} />
                    </section>
                    <ErrorDialog />
                    <section className='w-2/3'>
                        <VisitsTable laboratory_id={id} />
                    </section>
                </div>
            </div>
        </>
    )
}
