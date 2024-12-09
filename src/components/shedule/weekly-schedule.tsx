'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TimeSlot } from './time-slot'
import { WeekDayHeader } from './week-day-header'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7:00 AM to 8:00 PM

export function WeeklySchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const previousWeek = () => {
    const prevWeek = new Date(currentWeek)
    prevWeek.setDate(prevWeek.getDate() - 7)
    setCurrentWeek(prevWeek)
  }

  const nextWeek = () => {
    const nextWeek = new Date(currentWeek)
    nextWeek.setDate(nextWeek.getDate() + 7)
    setCurrentWeek(nextWeek)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={previousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            Semana del {currentWeek.toLocaleDateString()}
          </span>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Headers */}
          <div className="grid grid-cols-6 gap-2">
            <div className="h-12" /> {/* Empty corner */}
            {DAYS.map(day => (
              <WeekDayHeader key={day} day={day} />
            ))}
          </div>

          {/* Time slots */}
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-6 gap-2">
              <div className="flex items-center justify-end pr-4 text-sm text-muted-foreground">
                {hour}:00
              </div>
              {DAYS.map(day => (
                <TimeSlot
                  key={`${day}-${hour}`}
                  day={day}
                  hour={hour}
                  reserved={Math.random() > 0.7}
                  teacher={
                    Math.random() > 0.7
                      ? 'Prof. García'
                      : undefined
                  }
                  subject={
                    Math.random() > 0.7
                      ? 'Química General'
                      : undefined
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
