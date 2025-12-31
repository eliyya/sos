import Link, { LinkProps } from 'next/link'
import { ReactNode } from 'react'

interface ConditionalLinkProps extends LinkProps {
    condition: boolean
    children: ReactNode
}
export function ConditionalLink({
    condition,
    children,
    ...props
}: ConditionalLinkProps) {
    if (!condition) return <>{children}</>

    return <Link {...props}>{children}</Link>
}
