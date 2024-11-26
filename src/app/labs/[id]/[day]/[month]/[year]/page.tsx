import { Nav } from '@/components/Nav'

export interface LabPageProps {}

export default function LabPage(props: LabPageProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Nav />
            <main className="flex justify-center items-center">main</main>
        </div>
    )
}
