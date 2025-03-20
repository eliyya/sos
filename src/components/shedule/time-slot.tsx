'use client'

import { Button } from '@/components/Button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/Tooltip'
import { cn } from '@/lib/utils'

interface TimeSlotProps {
    day: string
    hour: number
    reserved?: boolean
    teacher?: string
    subject?: string
}

export function TimeSlot({
    day,
    hour,
    reserved,
    teacher,
    subject,
}: TimeSlotProps) {
    if (reserved && teacher && subject) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className={cn(
                                'bg-primary/20 border-primary h-12 cursor-pointer rounded-md border p-2 text-xs',
                                'hover:bg-primary/30 transition-colors',
                            )}
                        >
                            <div className='truncate font-medium'>
                                {subject}
                            </div>
                            <div className='text-muted-foreground truncate'>
                                {teacher}
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className='text-sm'>
                            <p className='font-medium'>{subject}</p>
                            <p>{teacher}</p>
                            <p>
                                {day} - {hour}:00
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <Button
            variant='outline'
            className='bg-card hover:bg-accent h-12 w-full'
            onClick={() => {
                // TODO: Implement reservation modal
                console.log('Reserve slot:', day, hour)
            }}
        >
            Reservar
        </Button>
    )
}
