import './globals.css'
import { Provider } from 'jotai'
import type { Metadata } from 'next'
import { Inter, Figtree } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { ToastProvider, ToastViewport } from '@/components/Toast'
import { APP_NAME } from '@/constants/client'
import { cn } from '@/lib/utils'
import { MantineProvider } from '@mantine/core'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

const inter = Inter({ subsets: ['latin'] })

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
        <html
            lang={locale}
            suppressHydrationWarning
            className={figtree.variable}
        >
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
                            <Provider>
                                <MantineProvider>
                                    <NuqsAdapter>{children}</NuqsAdapter>
                                </MantineProvider>
                            </Provider>
                        </NextIntlClientProvider>
                        <ToastViewport />
                    </ToastProvider>
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    )
}
