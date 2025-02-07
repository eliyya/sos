import { withTypeRoute } from '@eliyya/type-routes/next'
import { withSentryConfig } from '@sentry/nextjs'
import createNextIntlPlugin from 'next-intl/plugin'
import { withTypeCSSModule } from '@eliyya/typed-css-modules'

export default withTypeCSSModule(
    createNextIntlPlugin('./src/i18n.ts')(
        withSentryConfig(
            withTypeRoute({
                experimental: {
                    typedRoutes: false,
                },
                images: {
                    remotePatterns: [
                        {
                            protocol: 'https',
                            hostname: 'i.pinimg.com',
                        },
                    ],
                },
            }),
            {
                silent: false, // Opcional: Suprime logs durante el build
                telemetry: false,
            },
        ),
    ),
)
