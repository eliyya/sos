'use client'

import { SearchLaboratoriesProvider } from '@/contexts/laboratories.context'

export function Provider({ children }: { children: React.ReactNode }) {
    return <SearchLaboratoriesProvider>{children}</SearchLaboratoriesProvider>
}
