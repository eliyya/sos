import { Root, Item, Header, Trigger, Content } from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Accordion({
    className,
    ...props
}: ComponentProps<typeof Root>) {
    return (
        <Root
            {...props}
            className={cn('w-full max-w-md rounded-xl shadow-md', className)}
        />
    )
}

interface AccordionSectionProps extends ComponentProps<typeof Item> {
    name: string
}
export function AccordionSection({
    name,
    children,
    ...props
}: AccordionSectionProps) {
    return (
        <Item {...props}>
            <Header>
                <Trigger className='hover:bg-accent group text-muted-foreground flex w-full items-center justify-between px-4 py-3 text-left font-medium transition'>
                    {name}
                    <ChevronDownIcon className='h-4 w-4 transition-transform group-data-[state=open]:-rotate-180' />
                </Trigger>
            </Header>
            <Content className='data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down text-muted-foreground pb-3 pl-3 text-sm'>
                {children}
            </Content>
        </Item>
    )
}
