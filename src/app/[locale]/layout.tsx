export function generateStaticParams() {
    return [{ locale: 'es' }]
}

export default function RootLayout({ children }: LayoutProps<'/[locale]'>) {
    return children
}
