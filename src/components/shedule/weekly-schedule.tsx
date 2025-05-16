'use client'

import { Card } from '../Card'
import { ButtonLink } from '../Links'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TimeSlot } from './time-slot'
import { WeekDayHeader } from './week-day-header'
import app from '@eliyya/type-routes'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7:00 AM to 8:00 PM

interface WeeklyScheduleProps {
    currentWeek: Date
}
export function WeeklySchedule({ currentWeek }: WeeklyScheduleProps) {
    const today = new Date()
    return (
        <Card className='p-4'>
            <div className='mb-6 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <ButtonLink
                        variant='outline'
                        size='icon'
                        href={app.schedule.$id.$day.$month.$year(
                            '',
                            today.getDate().toString(),
                            today.getMonth().toString(),
                            today.getFullYear().toString(),
                        )}
                    >
                        <ChevronLeft className='h-4 w-4' />
                    </ButtonLink>
                    <span className='font-medium'>
                        Semana del {currentWeek.toLocaleDateString('es')}
                    </span>
                    <ButtonLink
                        variant='outline'
                        size='icon'
                        href={app.schedule.$id.$day.$month.$year(
                            '',
                            today.getDate().toString(),
                            today.getMonth().toString(),
                            today.getFullYear().toString(),
                        )}
                    >
                        <ChevronRight className='h-4 w-4' />
                    </ButtonLink>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <div className='min-w-[800px]'>
                    {/* Headers */}
                    <div className='grid grid-cols-6 gap-2'>
                        <div className='h-12' /> {/* Empty corner */}
                        {DAYS.map(day => (
                            <WeekDayHeader key={day} day={day} />
                        ))}
                    </div>

                    {/* Time slots */}
                    {HOURS.map(hour => (
                        <div key={hour} className='grid grid-cols-6 gap-2'>
                            <div className='text-muted-foreground flex items-center justify-end pr-4 text-sm'>
                                {hour}:00
                            </div>
                            {DAYS.map(day => (
                                <TimeSlot
                                    key={`${day}-${hour}`}
                                    day={day}
                                    hour={hour}
                                    reserved={Math.random() > 0.7}
                                    teacher={
                                        Math.random() > 0.7 ?
                                            'Prof. García'
                                        :   undefined
                                    }
                                    subject={
                                        Math.random() > 0.7 ?
                                            'Química General'
                                        :   undefined
                                    }
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}
