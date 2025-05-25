'use client'

import {
    ForwardedRef,
    InputHTMLAttributes,
    ReactNode,
    Ref,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import { LucideIcon, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MessageError } from './Error'

interface SimpleInputProps extends InputHTMLAttributes<HTMLInputElement> {
    ref?: Ref<HTMLInputElement>
}
export const SimpleInput = ({ className, ...props }: SimpleInputProps) => (
    <input
        {...props}
        className={cn(
            'border-input ring-offset-background text-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm',
            // file:
            'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
            // focus-visible:
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-hidden',
            // disabled:
            'disabled:cursor-not-allowed disabled:opacity-50',
            // placeholder:
            'placeholder:text-muted-foreground',
            className,
        )}
    />
)

interface CompletInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    children?: ReactNode
    error?: string
    icon?: LucideIcon
    ref?: ForwardedRef<HTMLInputElement>
}

export function CompletInput({
    children,
    label,
    required,
    error,
    id,
    className,
    icon,
    ref,
    ...props
}: CompletInputProps) {
    const Icon = icon
    const rid = useId()
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (!inputRef.current) return
        inputRef.current.setCustomValidity(error ?? '')
    }, [error])

    return (
        <div className='w-full'>
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
                <SimpleInput
                    {...props}
                    ref={el => {
                        inputRef.current = el
                        if (typeof ref === 'function') ref(el)
                        else if (ref) ref.current = el
                    }}
                    id={id ?? rid}
                    required={required}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                    className={cn(
                        'border-input ring-offset-background text-foreground flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm',
                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-hidden',
                        'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'placeholder:text-muted-foreground',
                        className,
                    )}
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

interface CompletTextareaProps
    extends InputHTMLAttributes<HTMLTextAreaElement> {
    label: string
    children?: ReactNode
    error?: string
    icon?: LucideIcon
    ref?: ForwardedRef<HTMLTextAreaElement>
}
export function CompletTextarea({
    children,
    label,
    id,
    required,
    error,
    className,
    icon,
    ref,
    ...props
}: CompletTextareaProps) {
    const Icon = icon
    const rid = useId()
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        const input = inputRef.current
        if (!input) return
        if (error) input.setCustomValidity(error)
        else input.setCustomValidity('')
        const handleInput = () => input.setCustomValidity('')
        input.addEventListener('input', handleInput)
        return () => input.removeEventListener('input', handleInput)
    }, [error])

    return (
        <div className='w-full space-y-2'>
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
                <textarea
                    {...props}
                    required={required}
                    id={id ?? rid}
                    ref={node => {
                        if (typeof ref === 'function') ref(node)
                        else if (ref) ref.current = node
                    }}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                    className={cn(
                        'border-input ring-offset-background text-foreground flex h-fit w-full resize-y rounded-md border px-3 py-2 pl-10 text-sm',
                        // focus-visible:
                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-hidden',
                        // file:
                        'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        // disabled:
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        // placeholder:
                        'placeholder:text-muted-foreground',
                        className,
                    )}
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
interface RetornableCompletInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    children?: React.ReactNode
    defaultValue: string | number
    error?: string
    icon?: LucideIcon
    ref?: ForwardedRef<HTMLInputElement>
}

export function RetornableCompletInput({
    children,
    label,
    onChange,
    id,
    error,
    defaultValue,
    icon,
    ref,
    ...props
}: RetornableCompletInputProps) {
    const Icon = icon
    const rid = useId()
    const [isChanged, setIsChanged] = useState(false)
    const internalRef = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState(() => `${defaultValue}`)

    useImperativeHandle(ref, () => internalRef.current!)

    useEffect(() => {
        if (!internalRef.current) return
        internalRef.current.setCustomValidity(error ?? '')
    }, [error])

    return (
        <div className='w-full space-y-2'>
            <label
                htmlFor={id ?? rid}
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
                {label}
            </label>
            <div className='relative'>
                {children}
                {Icon && (
                    <Icon className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                )}
                <SimpleInput
                    {...props}
                    ref={internalRef}
                    id={id ?? rid}
                    value={value}
                    onChange={e => {
                        const val = e.currentTarget.value
                        setValue(val)
                        onChange?.(e)
                        setIsChanged(val !== `${defaultValue}`)
                    }}
                    className={cn(
                        'border-input ring-offset-background text-foreground flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm',
                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-hidden',
                        'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'placeholder:text-muted-foreground',
                        {
                            'border-yellow-500 pr-10': isChanged,
                            'border-gray-300 dark:border-gray-600': !isChanged,
                        },
                    )}
                />
                {isChanged && (
                    <button
                        className='absolute top-0.5 right-1 cursor-pointer p-2'
                        onClick={e => {
                            e.preventDefault()
                            const newValue = `${defaultValue}`
                            setValue(newValue)
                            setIsChanged(false)
                            if (internalRef.current && onChange) {
                                internalRef.current.value = newValue
                                const syntheticEvent = new Event('input', {
                                    bubbles: true,
                                })
                                Object.defineProperty(
                                    syntheticEvent,
                                    'target',
                                    {
                                        writable: false,
                                        value: internalRef.current,
                                    },
                                )
                                Object.defineProperty(
                                    syntheticEvent,
                                    'currentTarget',
                                    {
                                        writable: false,
                                        value: internalRef.current,
                                    },
                                )
                                onChange(
                                    syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>,
                                )
                            }
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

interface RetornableCompletTextareaProps
    extends InputHTMLAttributes<HTMLTextAreaElement> {
    label: string
    children?: ReactNode
    error?: string
    defaultValue: string
    icon?: LucideIcon
    ref?: ForwardedRef<HTMLTextAreaElement>
}
export function RetornableCompletTextarea({
    children,
    label,
    id,
    required,
    error,
    className,
    onChange,
    icon,
    ref,
    ...props
}: RetornableCompletTextareaProps) {
    const Icon = icon
    const rid = useId()
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const [isChanged, setIsChanged] = useState(false)
    useEffect(() => {
        const input = inputRef.current
        if (!input) return
        if (error) input.setCustomValidity(error)
        else input.setCustomValidity('')
        const handleInput = () => input.setCustomValidity('')
        input.addEventListener('input', handleInput)
        return () => input.removeEventListener('input', handleInput)
    }, [error])
    return (
        <div className='w-full space-y-2'>
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
                <textarea
                    {...props}
                    required={required}
                    id={id ?? rid}
                    ref={node => {
                        if (typeof ref === 'function') ref(node)
                        else if (ref) ref.current = node
                        inputRef.current = node
                    }}
                    onChange={e => {
                        onChange?.(e)
                        setIsChanged(
                            e.currentTarget.value !== props.defaultValue,
                        )
                    }}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                    className={cn(
                        'border-input ring-offset-background text-foreground flex h-fit w-full resize-y rounded-md border px-3 py-2 pl-10 text-sm',
                        // focus-visible:
                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-hidden',
                        // file:
                        'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        // disabled:
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        // placeholder:
                        'placeholder:text-muted-foreground',
                        {
                            'border-yellow-500': isChanged,
                            'border-gray-300 dark:border-gray-600': !isChanged,
                        },
                        className,
                    )}
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
