'use client'

import { useAtom } from 'jotai'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog'
import { openCreateAtom } from '@/global/management-practices'
import { CalendarDialog } from './CalendarDialog'
import { CreateForm } from './CreateForm'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { CalendarIcon, FormInput } from 'lucide-react' // Asume que tienes Lucide instalado

interface CreateDialogProps {
    users: {
        id: string
        name: string
    }[]
    lab: {
        name: string
        id: string
        /**
         * * The end hour of the laboratory in minutes from 00:00
         */
        close_hour: number
        /**
         * * The start hour of the laboratory in minutes from 00:00
         */
        open_hour: number
    }
    isAdmin?: boolean
    user: {
        id: string
        name: string
    } | null
}

export function CreateDialog({ users, lab, isAdmin, user }: CreateDialogProps) {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1024
    )
    
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth)
        }
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    
    const isMobile = windowWidth < 768

    return (
        <Dialog open={open && !!user} onOpenChange={setOpen}>
            <DialogContent className={`w-full ${isMobile ? 'max-w-[95%] sm:max-w-lg' : 'max-w-4xl'}`}>
                <DialogHeader>
                    <DialogTitle className='w-full text-center text-xl sm:text-2xl md:text-3xl'>
                        Apartar el laboratorio &quot;{lab.name}&quot;
                    </DialogTitle>
                </DialogHeader>
                
                {isMobile ? (
                    // Versión móvil con pestañas
                    <Tabs defaultValue="form" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-4">
                            <TabsTrigger value="form" className="flex items-center gap-2">
                                <FormInput className="h-4 w-4" />
                                <span>Formulario</span>
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Calendario</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="form" className="mt-2">
                            <CreateForm
                                lab={lab}
                                users={users}
                                isAdmin={isAdmin}
                                user={user}
                            />
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-2">
                            <CalendarDialog lab={lab} />
                        </TabsContent>
                    </Tabs>
                ) : (
                    // Versión desktop con layout en dos columnas
                    <div className="flex flex-row gap-8">
                        <div className="w-1/2">
                            <CreateForm
                                lab={lab}
                                users={users}
                                isAdmin={isAdmin}
                                user={user}
                            />
                        </div>
                        <div className="w-1/2">
                            <CalendarDialog lab={lab} />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
