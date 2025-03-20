import { DashboardHeader } from '../../components/DashboardHeader'
import { Button } from '@/components/Button'
import { Plus } from 'lucide-react'
import { SearchInput } from './components/SearchInput'
import { UsersTable } from './components/UsersTable'

export default async function UserManagementPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <DashboardHeader
                    heading='Usuarios'
                    text='Gestión de Usuarios.'
                />
                <Button>
                    <Plus className='mr-3' />
                    Crear Usuario
                </Button>
            </div>
            <SearchInput />
            <UsersTable />
        </>
    )
}
