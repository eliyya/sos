import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group'
import { HelpCircleIcon, LucideIcon } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Activity, ComponentPropsWithRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface CompletFieldProps extends ComponentPropsWithRef<
    typeof InputGroupInput
> {
    tooltip?: string
    label: string
    icon?: LucideIcon
    error?: string
}
export function CompletField({
    id,
    label,
    tooltip,
    type,
    icon,
    error,
    ...props
}: CompletFieldProps) {
    const rid = useId()
    const Icon = icon
    return (
        <Field>
            <FieldLabel htmlFor={id ?? rid}>{label}</FieldLabel>
            <InputGroup>
                {Icon && (
                    <InputGroupAddon>
                        <Icon />
                    </InputGroupAddon>
                )}
                <InputGroupInput
                    id={id ?? rid}
                    {...props}
                    type={type}
                    className={cn({
                        '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none':
                            type === 'time',
                    })}
                />
                <Activity mode={tooltip ? 'visible' : 'hidden'}>
                    <InputGroupAddon align='inline-end'>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <InputGroupButton
                                        variant='ghost'
                                        aria-label='Help'
                                        size='icon-xs'
                                    >
                                        <HelpCircleIcon />
                                    </InputGroupButton>
                                }
                            ></TooltipTrigger>
                            <TooltipContent>
                                <p>{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </InputGroupAddon>
                </Activity>
            </InputGroup>
            <FieldError errors={error ? [{ message: error }] : []} />
        </Field>
    )
}
