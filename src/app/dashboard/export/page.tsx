import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { Button } from '@/components/Button'
import { Card, CardTitle, CardContent } from '@/components/Card'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import { db } from '@/prisma/db'
import { DashboardHeader } from '../components/DashboardHeader'

export default async function ExportPage() {
    const labs = await db.laboratory.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
    })
    return (
        <>
            <DashboardHeader
                heading='Exportar'
                text='Exporta los datos del sistema.'
            />
            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardTitle className='p-4'>
                        Exportar las Prácticas
                    </CardTitle>
                    <CardContent>
                        <form
                            action='/api/export/practices'
                            method='POST'
                            className='flex flex-col gap-4'
                        >
                            <div className='flex gap-4'>
                                <CompletInput
                                    required
                                    label='Desde'
                                    type='date'
                                    name='from'
                                />
                                <CompletInput
                                    required
                                    label='Hasta'
                                    type='date'
                                    name='to'
                                />
                            </div>
                            <CompletSelect
                                label='Laboratorio'
                                name='laboratory_id'
                                required
                                defaultValue={
                                    labs
                                        .filter(
                                            lab =>
                                                lab.type ===
                                                LABORATORY_TYPE.LABORATORY,
                                        )
                                        .map(lab => ({
                                            value: lab.id,
                                            label: lab.name,
                                        }))[0]
                                }
                                options={labs
                                    .filter(
                                        lab =>
                                            lab.type ===
                                            LABORATORY_TYPE.LABORATORY,
                                    )
                                    .map(lab => ({
                                        value: lab.id,
                                        label: lab.name,
                                    }))}
                            />
                            <CompletSelect
                                label='Formato'
                                name='format'
                                required
                                defaultValue={{ value: 'json', label: 'JSON' }}
                                options={[
                                    { value: 'json', label: 'JSON' },
                                    { value: 'csv', label: 'CSV' },
                                ]}
                            />
                            <Button type='submit'>Exportar</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardTitle className='p-4'>Exportar las Visitas</CardTitle>
                    <CardContent>
                        <form
                            action='/api/export/visits'
                            method='POST'
                            className='flex flex-col gap-4'
                        >
                            <div className='flex gap-4'>
                                <CompletInput
                                    required
                                    label='Desde'
                                    type='date'
                                    name='from'
                                />
                                <CompletInput
                                    required
                                    label='Hasta'
                                    type='date'
                                    name='to'
                                />
                            </div>
                            <CompletSelect
                                label='Centro de Cómputo'
                                name='laboratory_id'
                                required
                                value={
                                    labs
                                        .filter(
                                            lab =>
                                                lab.type ===
                                                LABORATORY_TYPE.COMPUTER_CENTER,
                                        )
                                        .map(lab => ({
                                            value: lab.id,
                                            label: lab.name,
                                        }))[0]
                                }
                                options={labs
                                    .filter(
                                        lab =>
                                            lab.type ===
                                            LABORATORY_TYPE.COMPUTER_CENTER,
                                    )
                                    .map(lab => ({
                                        value: lab.id,
                                        label: lab.name,
                                    }))}
                            />
                            <CompletSelect
                                label='Formato'
                                name='format'
                                required
                                defaultValue={{ value: 'json', label: 'JSON' }}
                                options={[
                                    { value: 'json', label: 'JSON' },
                                    { value: 'csv', label: 'CSV' },
                                ]}
                            />
                            <Button type='submit'>Exportar</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
