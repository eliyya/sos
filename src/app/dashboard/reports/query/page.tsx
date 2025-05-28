import { SQLEditor } from './components/Editor'

export default async function QueryPage() {
    return (
        <>
            <h1 className='text-2xl font-bold'>Query Page</h1>
            <p>This is the query page for reports.</p>
            <SQLEditor />
        </>
    )
}
