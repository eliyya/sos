import { Metadata } from 'next'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Card } from '@/components/ui/card'
import { BeakerIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import app from '@eliyya/type-routes'

export const metadata: Metadata = {
    title: 'Panel de Administrador | Laboratorios | LabReserve',
    description: 'Gestión de Laboratorios',
}

export default function AdminDashboardPage() {
    return (
        <>
            <DashboardHeader
                heading="Laboratorios"
                text="Gestión de Laboratorios."
            />
            <div className="grid gap-8 mt-8">
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <BeakerIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {'titulo'}
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {'value'}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {'description'}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Link href={app.admin.labs.add()}>
                        <Card className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {'Nuevo'}
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                        {'Agregar Laboratorio'}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {'Crea un nuevo laboratorio'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </>
    )
}
