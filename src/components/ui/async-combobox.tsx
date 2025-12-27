import { useEffect, useEffectEvent, useState, startTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { ChevronDownIcon } from 'lucide-react'

export interface AsyncComboboxItem {
    value: string
    label: string
}

interface BaseProps {
    placeholder?: string
    searchPlaceholder?: string
    onSearch: (query: string) => Promise<AsyncComboboxItem[]>
    debounceMs?: number
    disabled?: boolean
}

interface ControlledProps extends BaseProps {
    value: AsyncComboboxItem | null
    onChange: (value: AsyncComboboxItem) => void
    name?: string
}

interface UncontrolledProps extends BaseProps {
    name: string
    value?: never
    onChange?: never
}

type AsyncComboboxProps = ControlledProps | UncontrolledProps

export function AsyncCombobox(props: AsyncComboboxProps) {
    const {
        placeholder = 'Seleccionar...',
        searchPlaceholder = 'Buscar...',
        onSearch,
        debounceMs = 500,
        disabled,
    } = props

    const isControlled = 'value' in props

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [items, setItems] = useState<AsyncComboboxItem[]>([])
    const [internalValue, setInternalValue] =
        useState<AsyncComboboxItem | null>(null)

    const value = isControlled ? props.value : internalValue

    const searchEvent = useEffectEvent(async (query: string) => {
        const results = await onSearch(query)
        setItems(results)
    })

    useEffect(() => {
        if (!open) return

        const timeout = setTimeout(() => {
            startTransition(() => {
                searchEvent(search)
            })
        }, debounceMs)

        return () => clearTimeout(timeout)
    }, [open, search, debounceMs])

    const selectItem = (item: AsyncComboboxItem) => {
        if (isControlled) {
            props.onChange?.(item)
        } else {
            setInternalValue(item)
        }

        setOpen(false)
    }

    const inputName = 'name' in props ? props.name : undefined

    /* ------------------------------------------------------------
     * Render
     * ------------------------------------------------------------
     */

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    render={
                        <Button
                            variant='outline'
                            role='combobox'
                            className='w-50 justify-between'
                            aria-expanded={open}
                            disabled={disabled}
                        >
                            {value ? value.label : placeholder}
                            <ChevronDownIcon className='opacity-50' />
                        </Button>
                    }
                />

                <PopoverContent className='w-75 p-0'>
                    <Command>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            <CommandEmpty>No hay resultados</CommandEmpty>
                            <CommandGroup>
                                {items.map(item => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.label}
                                        onSelect={() => selectItem(item)}
                                    >
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {inputName && (
                <input
                    type='hidden'
                    name={inputName}
                    value={value?.value ?? ''}
                />
            )}
        </>
    )
}
