import { Button } from '@/components/ui/button'
import { BeakerIcon, BookOpenIcon, CalendarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Sistema de Reserva de Laboratorios
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Gestiona de manera eficiente las reservas de
            laboratorios para tus clases y experimentos.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/horario">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Ver Horarios
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Más Información
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="https://lh5.googleusercontent.com/proxy/b83vBWg43sUqgWTybklhexNsTKnkWaOoHTw7xi6qST9eLxqHbARB2ZFjJ8oSY-wcp3L8nZ8pYdOpLpSmmAl7KzESGXhVguN6btyQ6Oc"
            alt="Laboratorio"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Características Principales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CalendarIcon className="h-8 w-8" />}
              title="Reservas Simples"
              description="Sistema intuitivo para reservar laboratorios en pocos clics"
            />
            <FeatureCard
              icon={<BookOpenIcon className="h-8 w-8" />}
              title="Gestión de Horarios"
              description="Visualiza y administra los horarios de manera eficiente"
            />
            <FeatureCard
              icon={<BeakerIcon className="h-8 w-8" />}
              title="Múltiples Laboratorios"
              description="Soporte para diferentes tipos de laboratorios y equipos"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BeakerIcon className="h-6 w-6" />
              <span className="text-xl font-bold">
                LabReserve
              </span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:underline">
                Términos
              </a>
              <a href="#" className="hover:underline">
                Privacidad
              </a>
              <a href="#" className="hover:underline">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-lg">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
