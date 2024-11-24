import Link from 'next/link'
import { ReactNode } from 'react'

export interface ButtonLinkProps {
    href: string
    className?: string
    children?: ReactNode
    disabled?: boolean
}
export function ButtonPrimaryLink(props: ButtonLinkProps) {
    return (
        <Link
            {...props}
            className={`p-2 rounded-md cursor-pointer bg-black hover:bg-gray-900 text-white flex align-middle justify-center ${props.className}`}
        >
            {props.children}
        </Link>
    )
}

export function ButtonSecondaryLink(props: ButtonLinkProps) {
    if (props.disabled)
        return (
            <span
                {...props}
                className={`p-2 rounded-md cursor-pointer border text-gray-400 border-black flex align-middle justify-center ${props.className ?? ''}`}
            >
                {props.children}
            </span>
        )
    return (
        <Link
            {...props}
            className={`p-2 rounded-md cursor-pointer border border-black flex align-middle justify-center 
            hover:bg-gray-900 hover:text-white
            ${props.className}`}
        >
            {props.children}
        </Link>
    )
}
