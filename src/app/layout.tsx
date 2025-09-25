import './globals.css'
import { Provider } from 'jotai'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { ToastProvider, ToastViewport } from '@/components/Toast'
import { APP_NAME } from '@/constants/client'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: APP_NAME,
    description: 'sistemas de reserva',
}

export default async function RootLayout({
    children,
}: {
    children: ReactNode
}) {
    const locale = await getLocale()
    // const messages = await getMessages()
    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={cn('flex min-h-screen flex-col', inter.className)}
                suppressContentEditableWarning
            >
                <ThemeProvider
                    attribute='class'
                    defaultTheme='light'
                    enableSystem
                >
                    <ToastProvider swipeDirection='up' duration={3000}>
                        <NextIntlClientProvider>
                            <Provider>{children}</Provider>
                        </NextIntlClientProvider>
                        <ToastViewport />
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
