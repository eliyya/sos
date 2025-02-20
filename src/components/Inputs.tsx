'use client'
import {
    ComponentRef,
    forwardRef,
    InputHTMLAttributes,
    ReactNode,
    Ref,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import { Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
            'focus-visible:ring-ring focus-visible:outline-hidden focus-visible:ring-2',
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
}
export const CompletInput = forwardRef<
    ComponentRef<typeof SimpleInput>,
    CompletInputProps
>(
    (
        {
            children,
            label,
            required,
            error,
            id,
            className,
            ...props
        }: CompletInputProps,
        ref,
    ) => {
        const rid = useId()
        const inputRef = useRef<HTMLInputElement | null>(null)
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
                    <SimpleInput
                        {...props}
                        ref={node => {
                            if (typeof ref === 'function') ref(node)
                            else if (ref) ref.current = node
                            inputRef.current = node
                        }}
                        id={id ?? rid}
                        required={required}
                        aria-describedby={
                            error ? `${id ?? rid}-error` : undefined
                        }
                        className={cn(
                            'border-input ring-offset-background text-foreground flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm',
                            // focus-visible:
                            'focus-visible:ring-ring focus-visible:outline-hidden focus-visible:ring-2',
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
                    <span
                        id={`${id ?? rid}-error`}
                        className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'
                    >
                        {error}
                    </span>
                )}
            </div>
        )
    },
)
CompletInput.displayName = 'CompletInput'

interface CompletTextareaProps
    extends InputHTMLAttributes<HTMLTextAreaElement> {
    label: string
    children?: ReactNode
    error?: string
}
export const CompletTextarea = forwardRef<
    HTMLTextAreaElement,
    CompletTextareaProps
>(({ children, label, id, required, error, className, ...props }, ref) => {
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
                <textarea
                    {...props}
                    required={required}
                    id={id ?? rid}
                    ref={node => {
                        if (typeof ref === 'function') ref(node)
                        else if (ref) ref.current = node
                        inputRef.current = node
                    }}
                    aria-describedby={error ? `${id ?? rid}-error` : undefined}
                    className={cn(
                        'border-input ring-offset-background text-foreground flex h-fit w-full resize-y rounded-md border px-3 py-2 pl-10 text-sm',
                        // focus-visible:
                        'focus-visible:ring-ring focus-visible:outline-hidden focus-visible:ring-2',
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
                <span
                    id={`${id ?? rid}-error`}
                    className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'
                >
                    {error}
                </span>
            )}
        </div>
    )
})
CompletTextarea.displayName = 'CompletTextarea'

interface EditableCompletInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    children?: React.ReactNode
    defaultValue: string
}

export const RetornableCompletInput = forwardRef<
    ComponentRef<typeof SimpleInput>,
    EditableCompletInputProps
>(({ children, label, onChange, id, ...props }, ref) => {
    const rid = useId()
    const [isChanged, setIsChanged] = useState(false)
    const internalRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => internalRef.current!)

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
                <SimpleInput
                    {...props}
                    ref={internalRef}
                    id={id ?? rid}
                    onChange={e => {
                        onChange?.(e)
                        setIsChanged(
                            e.currentTarget.value !== props.defaultValue,
                        )
                    }}
                    className={cn(
                        'border-input ring-offset-background text-foreground flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm',
                        // focus-visible:
                        'focus-visible:ring-ring focus-visible:outline-hidden focus-visible:ring-2',
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
                    )}
                />
                <button
                    className='absolute right-1 top-1 cursor-pointer p-2'
                    type='reset'
                    onClick={e => {
                        e.preventDefault()
                        internalRef.current!.value = props.defaultValue
                        setIsChanged(false)
                    }}
                >
                    <Undo2 className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                </button>
            </div>
        </div>
    )
})
RetornableCompletInput.displayName = 'RetornableCompletInput'

interface RetornableCompletTextareaProps
    extends InputHTMLAttributes<HTMLTextAreaElement> {
    label: string
    children?: ReactNode
    error?: string
    defaultValue: string
}
export const RetornableCompletTextarea = forwardRef<
    HTMLTextAreaElement,
    RetornableCompletTextareaProps
>(
    (
        { children, label, id, required, error, className, onChange, ...props },
        ref,
    ) => {
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
                        aria-describedby={
                            error ? `${id ?? rid}-error` : undefined
                        }
                        className={cn(
                            'border-input ring-offset-background text-foreground flex h-fit w-full resize-y rounded-md border px-3 py-2 pl-10 text-sm',
                            // focus-visible:
                            'focus-visible:ring-ring focus-visible:outline-hidden focus-visible:ring-2',
                            // file:
                            'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
                            // disabled:
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            // placeholder:
                            'placeholder:text-muted-foreground',
                            {
                                'border-yellow-500': isChanged,
                                'border-gray-300 dark:border-gray-600':
                                    !isChanged,
                            },
                            className,
                        )}
                    />
                </div>
                {error && (
                    <span
                        id={`${id ?? rid}-error`}
                        className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'
                    >
                        {error}
                    </span>
                )}
            </div>
        )
    },
)
RetornableCompletTextarea.displayName = 'RetornableCompletTextarea'
