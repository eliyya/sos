export function DashboardHeader({
    heading,
    text,
    children,
}: {
    heading: string
    text?: string
    children?: React.ReactNode
}) {
    return (
        <div className='flex items-center justify-between'>
            <div className='grid gap-1'>
                <h1 className='text-3xl font-bold tracking-tight'>{heading}</h1>
                {text && (
                    <p className='text-muted-foreground text-lg'>{text}</p>
                )}
            </div>
            {children}
        </div>
    )
}
