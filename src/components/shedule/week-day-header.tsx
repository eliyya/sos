export function WeekDayHeader({ day }: { day: string }) {
    return (
        <div className="h-12 flex items-center justify-center font-medium bg-muted rounded-md">
            {day}
        </div>
    )
}
