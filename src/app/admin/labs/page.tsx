import { ButtonPrimaryLink } from '@/components/Buttons'
import { Nav } from '@/components/Nav'
import Link from 'next/link'
import { LabCard } from './LabCard'
import { root } from '@eliyya/type-routes'

const LabsPage = () => {
    return (
        <>
            <Nav />
            <main className="flex-1 flex justify-center align-middle items-center py-4">
                <div className="min-w-96 max-w-5xl border border-solid border-[#ddd] rounded-xl overflow-hidden shadow-lg">
                    <header className="flex border border-solid border-[#ddd]">
                        <Link
                            href={root.admin.labs()}
                            className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-black text-white"
                        >
                            Laboratorios
                        </Link>
                        <Link
                            href={root.admin.teachers()}
                            className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-white text-black"
                        >
                            Docentes
                        </Link>
                    </header>
                    <div className="p-5 flex flex-col gap-2">
                        <LabCard
                            name={'Laboratorio 1'}
                            open_hour_in_minutes={9 * 60}
                            close_hour_in_minutes={16 * 60}
                            id={'1'}
                        />
                        <ButtonPrimaryLink href="/admin/labs/new">
                            <svg
                                fill="#ffffff"
                                viewBox="0 0 27.963 27.963"
                                className="h-5"
                            >
                                <path d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981,C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z" />
                            </svg>
                        </ButtonPrimaryLink>
                    </div>
                </div>
            </main>
        </>
    )
}

export default LabsPage
