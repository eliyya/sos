import styles from './styles.module.css'
import { Nav } from '@/components/Nav'

export default function AppPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Nav />
            <main className={styles.main}>main</main>
        </div>
    )
}
