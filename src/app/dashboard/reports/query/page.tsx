import { DashboardHeader } from '../../components/DashboardHeader'
import { SQLEditor } from './components/Editor'
import { QueryResult } from './components/QueryResult'
import { RunButton } from './components/RunButton'

export default async function QueryPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <DashboardHeader heading='Query' text='Ejecutar consultas' />
                <RunButton />
            </div>
            <SQLEditor />
            <QueryResult />
        </>
    )
}
