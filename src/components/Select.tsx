'use client'

import {
    ScrollDownButton,
    ScrollUpButton,
    ItemIndicator,
    Separator,
    Viewport,
    ItemText,
    Trigger,
    Content,
    Portal,
    Group,
    Label,
    Value,
    Icon,
    Root,
    Item,
} from '@radix-ui/react-select'
import {
    ComponentPropsWithoutRef,
    ComponentProps,
    ComponentRef,
    forwardRef,
    ReactNode,
    useId,
    useRef,
    useImperativeHandle,
    useEffect,
} from 'react'
import { Check, ChevronDown, ChevronUp, LucideIcon, Undo2 } from 'lucide-react'
import ReactSelect, {
    MultiValue,
    OnChangeValue,
    SelectInstance,
    SingleValue,
} from 'react-select'
import ReactCreatableSelect from 'react-select/creatable'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { MessageError } from './Error'

export const Select = Root

export const SelectGroup = Group

export const SelectValue = Value

export const SelectTrigger = ({
    className,
    children,
    ...props
}: ComponentProps<typeof Trigger>) => (
    <Trigger
        className={cn(
            'border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
            // [&>span]
            '[&>span]:line-clamp-1',
            // placeholder:
            'placeholder:text-muted-foreground',
            // disabled:
            'disabled:cursor-not-allowed disabled:opacity-50',
            // focus:
            'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
            className,
        )}
        {...props}
    >
        {children}
        {Icon && (
            <Icon className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
        )}
        <Icon asChild>
            <ChevronDown className='h-4 w-4 opacity-50' />
        </Icon>
    </Trigger>
)

export const SelectScrollUpButton = ({
    className,
    ...props
}: ComponentProps<typeof ScrollUpButton>) => (
    <ScrollUpButton
        className={cn(
            'flex cursor-default items-center justify-center py-1',
            className,
        )}
        {...props}
    >
        <ChevronUp className='h-4 w-4' />
    </ScrollUpButton>
)

export const SelectScrollDownButton = ({
    className,
    ...props
}: ComponentProps<typeof ScrollDownButton>) => (
    <ScrollDownButton
        className={cn(
            'flex cursor-default items-center justify-center py-1',
            className,
        )}
        {...props}
    >
        <ChevronDown className='h-4 w-4' />
    </ScrollDownButton>
)

export const SelectContent = forwardRef<
    ComponentRef<typeof Content>,
    ComponentPropsWithoutRef<typeof Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
    <Portal>
        <Content
            ref={ref}
            className={cn(
                'bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
                // data-[state=open]:
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                // data-[state=closed]:
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                // data-[side=bottom]:
                'data-[side=bottom]:slide-in-from-top-2',
                // data-[side=top]:
                'data-[side=top]:slide-in-from-bottom-2',
                //data-[side=right]:
                'data-[side=right]:slide-in-from-left-2',
                // data-[side=left]:
                'data-[side=left]:slide-in-from-right-2',
                {
                    'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1':
                        position === 'popper',
                },
                className,
            )}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <Viewport
                className={cn('p-1', {
                    'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]':
                        position === 'popper',
                })}
            >
                {children}
                {Icon && (
                    <Icon className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                )}
            </Viewport>
            <SelectScrollDownButton />
        </Content>
    </Portal>
))
SelectContent.displayName = 'SelectContent'

export const SelectLabel = ({
    className,
    ...props
}: ComponentProps<typeof Label>) => (
    <Label
        className={cn('py-1.5 pr-2 pl-8 text-sm font-semibold', className)}
        {...props}
    />
)

export const SelectItem = ({
    className,
    children,
    ...props
}: ComponentProps<typeof Item>) => (
    <Item
        className={cn(
            'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none',
            // focus:
            'focus:bg-accent focus:text-accent-foreground',
            // data-[disabled]:
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className,
        )}
        {...props}
    >
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
            <ItemIndicator>
                <Check className='h-4 w-4' />
            </ItemIndicator>
        </span>

        <ItemText>
            {children}
            {Icon && (
                <Icon className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
            )}
        </ItemText>
    </Item>
)

export const SelectSeparator = ({
    className,
    ...props
}: ComponentProps<typeof Separator>) => (
    <Separator
        className={cn('bg-muted -mx-1 my-1 h-px', className)}
        {...props}
    />
)

interface CompletSelectProps<O, IM extends boolean>
    extends ComponentProps<typeof ReactSelect<O, IM>> {
    label: string
    children?: ReactNode
    icon?: LucideIcon
    error?: string
    containerClassName?: string
}
export function CompletSelect<
    O extends object = { value: string; label: string },
    IM extends boolean = false,
>({
    options,
    children,
    icon,
    label,
    required,
    error,
    id,
    containerClassName,
    ref,
    ...props
}: CompletSelectProps<O, IM>) {
    const rid = useId()
    const Icon = icon
    const selectRef = useRef<SelectInstance<O, IM>>(null)

    useImperativeHandle(ref, () => selectRef.current!)

    // Manejo manual de required (ya que ReactSelect no lo soporta nativamente)
    useEffect(() => {
        if (!selectRef.current || !required) return
        selectRef.current.controlRef
            ?.querySelector('input')
            ?.setCustomValidity(error ?? '')
    }, [error, required])

    return (
        <div className={cn('w-full space-y-2', containerClassName)}>
            <label
                htmlFor={id ?? rid}
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
                {label}
                {required && <span className='ml-1'>*</span>}
            </label>
            <div className='relative'>
                {children}
                {Icon && (
                    <Icon className='absolute top-2 left-3 z-10 h-5 w-5 text-gray-500 dark:text-gray-400' />
                )}
                <ReactSelect
                    {...props}
                    ref={selectRef}
                    options={options}
                    styles={{
                        control: base => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--border-secondary)',
                            borderRadius: 'var(--radius-md)',
                            paddingLeft: children ? '2rem' : base.paddingLeft,
                        }),
                        menu: base => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-primary)',
                        }),
                        option: (
                            base,
                            {
                                isSelected,
                                isFocused,
                            }: { isSelected: boolean; isFocused: boolean },
                        ) => ({
                            ...base,
                            backgroundColor:
                                isSelected ?
                                    'color-mix(in oklab, var(--color-background) 90%, var(--color-foreground))'
                                : isFocused ?
                                    'color-mix(in oklab, var(--color-background) 95%, var(--color-foreground))'
                                :   'var(--color-background)',
                            color:
                                isSelected || isFocused ?
                                    'var(--color-primary)'
                                :   'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                            ':active': {
                                backgroundColor:
                                    'color-mix(in oklab, var(--color-background) 85%, var(--color-foreground))',
                            },
                        }),
                        placeholder: base => ({
                            ...base,
                            color: 'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                            marginLeft: icon ? '2rem' : base.marginLeft,
                        }),
                        singleValue: base => ({
                            ...base,
                            color: 'var(--color-primary)',
                            marginLeft: icon ? '2rem' : base.marginLeft,
                        }),
                        input: base => ({
                            ...base,
                            marginLeft: icon ? '2rem' : base.marginLeft,
                        }),
                    }}
                    id={id ?? rid}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                />
            </div>
            {error && (
                <MessageError
                    className='absolute mt-0'
                    id={`${id ?? rid}-error`}
                >
                    {error}
                </MessageError>
            )}
        </div>
    )
}

function normalizeValue<T>(
    value: MultiValue<T> | SingleValue<T>,
): MultiValue<T> {
    return Array.isArray(value) ? value : ([value] as MultiValue<T>)
}

interface RetornableCompletSelectProps<O, IM extends boolean>
    extends CompletSelectProps<O, IM> {
    originalValue: MultiValue<O> | SingleValue<O>
}
export function RetornableCompletSelect<
    T extends object = { value: string; label: string },
    IM extends boolean = false,
>({
    options,
    children,
    icon,
    label,
    required,
    error,
    id,
    containerClassName,
    originalValue,
    ref,
    ...props
}: RetornableCompletSelectProps<T, IM>) {
    const rid = useId()
    const Icon = icon
    const selectRef = useRef<SelectInstance<T, IM>>(null)
    useImperativeHandle(ref, () => selectRef.current!)
    const [isChanged, setIsChanged] = useState(false)
    const [currentValue, setCurrentValue] = useState<
        MultiValue<T> | SingleValue<T>
    >(originalValue)

    // Manejo manual de required (ya que ReactSelect no lo soporta nativamente)
    useEffect(() => {
        if (!selectRef.current || !required) return
        selectRef.current.controlRef
            ?.querySelector('input')
            ?.setCustomValidity(error ?? '')
    }, [error, required])

    useEffect(() => {
        if (
            selectRef.current &&
            JSON.stringify(normalizeValue(currentValue), (k, v) =>
                typeof v === 'bigint' ? v.toString() : v,
            ) !==
                JSON.stringify(normalizeValue(originalValue), (k, v) =>
                    typeof v === 'bigint' ? v.toString() : v,
                )
        ) {
            setIsChanged(true)
        }
    }, [currentValue, originalValue])

    return (
        <div className={cn('w-full space-y-2', containerClassName)}>
            <label
                htmlFor={id ?? rid}
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
                {label}
                {required && <span className='ml-1'>*</span>}
            </label>
            <div className='relative block'>
                {children}
                {Icon && (
                    <Icon className='absolute top-2 left-3 z-10 h-5 w-5 text-gray-500 dark:text-gray-400' />
                )}
                <ReactSelect
                    {...props}
                    ref={selectRef}
                    options={options}
                    defaultValue={originalValue}
                    value={currentValue}
                    onChange={(option, actionMeta) => {
                        setCurrentValue(option as OnChangeValue<T, IM>) // Guardamos el nuevo valor
                        setIsChanged(
                            JSON.stringify(normalizeValue(option), (k, v) =>
                                typeof v === 'bigint' ? v.toString() : v,
                            ) !==
                                JSON.stringify(
                                    normalizeValue(originalValue),
                                    (k, v) =>
                                        typeof v === 'bigint' ?
                                            v.toString()
                                        :   v,
                                ),
                        )
                        props.onChange?.(
                            option as OnChangeValue<T, IM>,
                            actionMeta,
                        )
                    }}
                    styles={{
                        control: base => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            borderColor:
                                isChanged ?
                                    'var(--color-yellow-500)'
                                :   'var(--color-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            paddingLeft: children ? '2rem' : base.paddingLeft,
                        }),
                        container: base => ({
                            ...base,
                            flex: '1',
                            // paddingLeft:
                            //     children ? '1rem' : base.paddingLeft,
                        }),
                        menu: base => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-primary)',
                        }),
                        option: (base, { isSelected, isFocused }) => ({
                            ...base,
                            backgroundColor:
                                isSelected ?
                                    'color-mix(in oklab, var(--color-background) 90%, var(--color-foreground))'
                                : isFocused ?
                                    'color-mix(in oklab, var(--color-background) 95%, var(--color-foreground))'
                                :   'var(--color-background)',
                            color:
                                isSelected || isFocused ?
                                    'var(--color-primary)'
                                :   'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                            ':active': {
                                backgroundColor:
                                    'color-mix(in oklab, var(--color-background) 85%, var(--color-foreground))',
                            },
                        }),
                        placeholder: base => ({
                            ...base,
                            color: 'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                            marginLeft: icon ? '2rem' : base.marginLeft,
                        }),
                        singleValue: base => ({
                            ...base,
                            color: 'var(--color-primary)',
                            marginLeft: icon ? '2rem' : base.marginLeft,
                        }),
                        indicatorsContainer: base => ({
                            ...base,
                            paddingRight: isChanged ? '2rem' : base.paddingLeft,
                        }),
                    }}
                    id={id ?? rid}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                />
                {isChanged && (
                    <button
                        className='absolute top-0.5 right-1 cursor-pointer p-2'
                        onClick={e => {
                            e.preventDefault()
                            setCurrentValue(originalValue)
                            setIsChanged(false)
                        }}
                    >
                        <Undo2 className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </button>
                )}
            </div>
            {error && (
                <MessageError
                    className='absolute mt-0'
                    id={`${id ?? rid}-error`}
                >
                    {error}
                </MessageError>
            )}
        </div>
    )
}

export function CompletCreatableSelect<
    T extends object = { value: string; label: string },
    IM extends boolean = false,
>({
    options,
    children,
    icon,
    label,
    required,
    error,
    id,
    containerClassName,
    ref,
    ...props
}: CompletSelectProps<T, IM>) {
    const rid = useId()
    const Icon = icon
    const selectRef = useRef<SelectInstance<T, IM>>(null)

    useImperativeHandle(ref, () => selectRef.current!)

    useEffect(() => {
        if (!selectRef.current || !required) return
        selectRef.current.controlRef
            ?.querySelector('input')
            ?.setCustomValidity(error ?? '')
    }, [error, required])

    return (
        <div className={cn('w-full space-y-2', containerClassName)}>
            <label
                htmlFor={id ?? rid}
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
                {label}
                {required && <span className='ml-1'>*</span>}
            </label>
            <div className='relative'>
                {children}
                {Icon && (
                    <Icon className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                )}
                <ReactCreatableSelect
                    {...props}
                    ref={selectRef}
                    isClearable
                    options={options}
                    styles={{
                        control: base => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--border-secondary)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-md)',
                            paddingLeft: children ? '2rem' : base.paddingLeft,
                        }),
                        menu: base => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-primary)',
                        }),
                        option: (
                            base,
                            {
                                isSelected,
                                isFocused,
                            }: { isSelected: boolean; isFocused: boolean },
                        ) => ({
                            ...base,
                            backgroundColor:
                                isSelected ?
                                    'color-mix(in oklab, var(--color-background) 90%, var(--color-foreground))'
                                : isFocused ?
                                    'color-mix(in oklab, var(--color-background) 95%, var(--color-foreground))'
                                :   'var(--color-background)',
                            color:
                                isSelected || isFocused ?
                                    'var(--color-primary)'
                                :   'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                            ':active': {
                                backgroundColor:
                                    'color-mix(in oklab, var(--color-background) 85%, var(--color-foreground))',
                            },
                        }),
                        placeholder: base => ({
                            ...base,
                            color: 'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                        }),
                        singleValue: base => ({
                            ...base,
                            color: 'var(--color-primary)',
                        }),
                    }}
                    id={id ?? rid}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                />
            </div>
            {error && (
                <MessageError
                    className='absolute mt-0'
                    id={`${id ?? rid}-error`}
                >
                    {error}
                </MessageError>
            )}
        </div>
    )
}

export function RetornableCompletCreatableSelect<
    T extends object = { value: string; label: string },
    IM extends boolean = false,
>({
    options,
    children,
    icon,
    label,
    required,
    error,
    id,
    containerClassName,
    originalValue: defaultValue,
    ref,
    ...props
}: RetornableCompletSelectProps<T, IM>) {
    const rid = useId()
    const Icon = icon
    const selectRef = useRef<SelectInstance<T, IM>>(null)
    useImperativeHandle(ref, () => selectRef.current!)
    const [isChanged, setIsChanged] = useState(false)
    const [currentValue, setCurrentValue] = useState<
        MultiValue<T> | SingleValue<T>
    >(defaultValue)

    // Manejo manual de required (ya que ReactSelect no lo soporta nativamente)
    useEffect(() => {
        if (!selectRef.current || !required) return
        selectRef.current.controlRef
            ?.querySelector('input')
            ?.setCustomValidity(error ?? '')
    }, [error, required])

    useEffect(() => {
        if (
            selectRef.current &&
            JSON.stringify(normalizeValue(currentValue), (k, v) =>
                typeof v === 'bigint' ? v.toString() : v,
            ) !==
                JSON.stringify(normalizeValue(defaultValue), (k, v) =>
                    typeof v === 'bigint' ? v.toString() : v,
                )
        ) {
            setIsChanged(true)
        }
    }, [currentValue, defaultValue])

    return (
        <div className={cn('w-full space-y-2', containerClassName)}>
            <label
                htmlFor={id ?? rid}
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
                {label}
                {required && <span className='ml-1'>*</span>}
            </label>
            <div className='relative'>
                {children}
                {Icon && (
                    <Icon className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                )}
                <ReactCreatableSelect
                    {...props}
                    ref={selectRef}
                    isClearable
                    options={options}
                    defaultValue={defaultValue}
                    value={currentValue}
                    onChange={(option, actionMeta) => {
                        setCurrentValue(option as OnChangeValue<T, IM>) // Guardamos el nuevo valor
                        setIsChanged(
                            JSON.stringify(normalizeValue(option), (k, v) =>
                                typeof v === 'bigint' ? v.toString() : v,
                            ) !==
                                JSON.stringify(
                                    normalizeValue(defaultValue),
                                    (k, v) =>
                                        typeof v === 'bigint' ?
                                            v.toString()
                                        :   v,
                                ),
                        )
                        props.onChange?.(
                            option as OnChangeValue<T, IM>,
                            actionMeta,
                        )
                    }}
                    styles={{
                        control: base => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            borderColor:
                                isChanged ?
                                    'var(--color-yellow-500)'
                                :   'var(--color-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            paddingLeft: children ? '2rem' : base.paddingLeft,
                        }),
                        container: base => ({
                            ...base,
                            flex: '1',
                            // paddingLeft:
                            //     children ? '1rem' : base.paddingLeft,
                        }),
                        menu: base => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-primary)',
                        }),
                        option: (base, { isSelected, isFocused }) => ({
                            ...base,
                            backgroundColor:
                                isSelected ?
                                    'color-mix(in oklab, var(--color-background) 90%, var(--color-foreground))'
                                : isFocused ?
                                    'color-mix(in oklab, var(--color-background) 95%, var(--color-foreground))'
                                :   'var(--color-background)',
                            color:
                                isSelected || isFocused ?
                                    'var(--color-primary)'
                                :   'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                            ':active': {
                                backgroundColor:
                                    'color-mix(in oklab, var(--color-background) 85%, var(--color-foreground))',
                            },
                        }),
                        placeholder: base => ({
                            ...base,
                            color: 'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                        }),
                        singleValue: base => ({
                            ...base,
                            color: 'var(--color-primary)',
                        }),
                        indicatorsContainer: base => ({
                            ...base,
                            paddingRight: isChanged ? '2rem' : base.paddingLeft,
                        }),
                    }}
                    id={id ?? rid}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                />
                {isChanged && (
                    <button
                        className='absolute top-0.5 right-1 cursor-pointer p-2'
                        onClick={e => {
                            e.preventDefault()
                            setCurrentValue(defaultValue)
                            setIsChanged(false)
                        }}
                    >
                        <Undo2 className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </button>
                )}
            </div>
            {error && (
                <MessageError
                    className='absolute mt-0'
                    id={`${id ?? rid}-error`}
                >
                    {error}
                </MessageError>
            )}
        </div>
    )
}

interface SimpleSelectProps<O, IM extends boolean>
    extends ComponentProps<typeof ReactSelect<O, IM>> {
    children?: ReactNode
    icon?: LucideIcon
}
export function SimpleSelect<
    O extends object = { value: string; label: string },
    IM extends boolean = false,
>({ children, options, icon, id, ...props }: SimpleSelectProps<O, IM>) {
    const rid = useId()
    const Icon = icon
    const selectRef = useRef<SelectInstance<O, IM>>(null)

    return (
        <div className='relative'>
            {children}
            {Icon && (
                <Icon className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
            )}
            <ReactSelect
                {...props}
                ref={selectRef}
                options={options}
                styles={{
                    control: base => ({
                        ...base,
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--border-secondary)',
                        borderRadius: 'var(--radius-md)',
                        paddingLeft: children ? '2rem' : base.paddingLeft,
                    }),
                    menu: base => ({
                        ...base,
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-primary)',
                    }),
                    option: (
                        base,
                        {
                            isSelected,
                            isFocused,
                        }: { isSelected: boolean; isFocused: boolean },
                    ) => ({
                        ...base,
                        backgroundColor:
                            isSelected ?
                                'color-mix(in oklab, var(--color-background) 90%, var(--color-foreground))'
                            : isFocused ?
                                'color-mix(in oklab, var(--color-background) 95%, var(--color-foreground))'
                            :   'var(--color-background)',
                        color:
                            isSelected || isFocused ?
                                'var(--color-primary)'
                            :   'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                        ':active': {
                            backgroundColor:
                                'color-mix(in oklab, var(--color-background) 85%, var(--color-foreground))',
                        },
                    }),
                    placeholder: base => ({
                        ...base,
                        color: 'color-mix(in oklab, var(--color-primary) 75%, var(--color-secondary))',
                    }),
                    singleValue: base => ({
                        ...base,
                        color: 'var(--color-primary)',
                    }),
                }}
                id={id ?? rid}
            />
        </div>
    )
}
