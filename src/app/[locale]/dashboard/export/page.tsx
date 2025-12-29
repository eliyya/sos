import { LABORATORY_TYPE, STATUS } from '@/prisma/generated/browser'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent } from '@/components/Card'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import { db } from '@/prisma/db'
import { DashboardHeader } from '../components/DashboardHeader'
import { getTranslations } from 'next-intl/server'

export default async function ExportPage() {
    const t = await getTranslations('exports')
    const labs = await db.laboratory.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
    })

    return (
        <>
            <DashboardHeader heading={t('export')} text={t('system_data')} />
            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardTitle className='p-4'>
                        {t('export_practices')}
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
                                    label={t('from')}
                                    type='date'
                                    name='from'
                                />
                                <CompletInput
                                    required
                                    label={t('until')}
                                    type='date'
                                    name='to'
                                />
                            </div>
                            <CompletSelect
                                label={t('laboratory')}
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
                                label={t('format')}
                                name='format'
                                required
                                defaultValue={{ value: 'json', label: 'JSON' }}
                                options={[
                                    { value: 'json', label: 'JSON' },
                                    { value: 'csv', label: 'CSV' },
                                ]}
                            />
                            <Button type='submit'>{t('export')}</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardTitle className='p-4'>{t('export_visits')}</CardTitle>
                    <CardContent>
                        <form
                            action='/api/export/visits'
                            method='POST'
                            className='flex flex-col gap-4'
                        >
                            <div className='flex gap-4'>
                                <CompletInput
                                    required
                                    label={t('from')}
                                    type='date'
                                    name='from'
                                />
                                <CompletInput
                                    required
                                    label={t('until')}
                                    type='date'
                                    name='to'
                                />
                            </div>
                            <CompletSelect
                                label={t('computer_center')}
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
                                label={t('format')}
                                name='format'
                                required
                                defaultValue={{ value: 'json', label: 'JSON' }}
                                options={[
                                    { value: 'json', label: 'JSON' },
                                    { value: 'csv', label: 'CSV' },
                                ]}
                            />
                            <Button type='submit'>{t('export')}</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
