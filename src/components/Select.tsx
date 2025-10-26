'use client'

import { LucideIcon, Undo2Icon } from 'lucide-react'
import {
    ComponentProps,
    ReactNode,
    useId,
    useRef,
    useImperativeHandle,
    useEffect,
    useState,
    Activity,
} from 'react'
import ReactSelect, {
    MultiValue,
    OnChangeValue,
    SelectInstance,
    SingleValue,
} from 'react-select'
import ReactCreatableSelect from 'react-select/creatable'
import { cn } from '@/lib/utils'
import { MessageError } from './Error'

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
                <Activity mode={required ? 'visible' : 'hidden'}>
                    <span className='ml-1'>*</span>
                </Activity>
            </label>
            <div className='relative'>
                {children}
                {Icon && (
                    <Icon className='absolute top-2 left-3 z-10 h-5 w-5 text-gray-500 dark:text-gray-400' />
                )}
                <ReactSelect
                    {...props}
                    required={required}
                    ref={selectRef}
                    options={options}
                    styles={{
                        control: (base, { isFocused }) => ({
                            ...base,
                            backgroundColor: 'var(--color-background)',
                            borderColor:
                                isFocused ? 'var(--color-ring)' : (
                                    'var(--color-input)'
                                ),
                            outline: 'none',
                            borderRadius: 'var(--radius-md)',
                            paddingLeft: children ? '2rem' : base.paddingLeft,
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
                        input: base => ({
                            ...base,
                            marginLeft: icon ? '2rem' : base.marginLeft,
                        }),
                    }}
                    id={id ?? rid}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                />
            </div>
            <Activity mode={error ? 'visible' : 'hidden'}>
                <MessageError
                    className='absolute mt-0'
                    id={`${id ?? rid}-error`}
                >
                    {error}
                </MessageError>
            </Activity>
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
                <Activity mode={required ? 'visible' : 'hidden'}>
                    <span className='ml-1'>*</span>
                </Activity>
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
                <Activity mode={isChanged ? 'visible' : 'hidden'}>
                    <button
                        className='absolute top-0.5 right-1 cursor-pointer p-2'
                        onClick={e => {
                            e.preventDefault()
                            setCurrentValue(originalValue)
                            setIsChanged(false)
                        }}
                    >
                        <Undo2Icon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </button>
                </Activity>
            </div>
            <Activity mode={error ? 'visible' : 'hidden'}>
                <MessageError
                    className='absolute mt-0'
                    id={`${id ?? rid}-error`}
                >
                    {error}
                </MessageError>
            </Activity>
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
                <Activity mode={required ? 'visible' : 'hidden'}>
                    <span className='ml-1'>*</span>
                </Activity>
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
            <Activity mode={error ? 'visible' : 'hidden'}>
                <MessageError
                    className='absolute mt-0'
                    id={`${id ?? rid}-error`}
                >
                    {error}
                </MessageError>
            </Activity>
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
                <Activity mode={required ? 'visible' : 'hidden'}>
                    <span className='ml-1'>*</span>
                </Activity>
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
                <Activity mode={isChanged ? 'visible' : 'hidden'}>
                    <button
                        className='absolute top-0.5 right-1 cursor-pointer p-2'
                        onClick={e => {
                            e.preventDefault()
                            setCurrentValue(defaultValue)
                            setIsChanged(false)
                        }}
                    >
                        <Undo2Icon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </button>
                </Activity>
            </div>
            <Activity mode={error ? 'visible' : 'hidden'}>
                <MessageError
                    className='absolute mt-0'
                    id={`${id ?? rid}-error`}
                >
                    {error}
                </MessageError>
            </Activity>
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
