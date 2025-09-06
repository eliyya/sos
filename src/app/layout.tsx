import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ToastProvider } from '@/components/Toast'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Provider } from 'jotai'
import { APP_NAME } from '@/constants/client'

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
    const messages = await getMessages()
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
                    <ToastProvider>
                        <NextIntlClientProvider messages={messages}>
                            <Provider>{children}</Provider>
                        </NextIntlClientProvider>
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
