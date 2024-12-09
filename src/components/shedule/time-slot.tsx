'use client'

import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
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
                                'h-12 rounded-md bg-primary/20 border border-primary p-2 text-xs cursor-pointer',
                                'hover:bg-primary/30 transition-colors',
                            )}
                        >
                            <div className="font-medium truncate">
                                {subject}
                            </div>
                            <div className="text-muted-foreground truncate">
                                {teacher}
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-sm">
                            <p className="font-medium">{subject}</p>
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
            variant="outline"
            className="h-12 w-full bg-card hover:bg-accent"
            onClick={() => {
                // TODO: Implement reservation modal
                console.log('Reserve slot:', day, hour)
            }}
        >
            Reservar
        </Button>
    )
}
