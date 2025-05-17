import 'fake-indexeddb/auto'
import { withTypeRoute } from '@eliyya/type-routes/next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withTypeCSSModule } from '@eliyya/typed-css-modules'
import withSerwistInit from '@serwist/next'

export default withSerwistInit({
    // Note: This is only an example. If you use Pages Router,
    // use something else that works, such as "service-worker/index.ts".
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
})(
    withTypeCSSModule(
        createNextIntlPlugin('./src/i18n.ts')(
            withTypeRoute({
                experimental: {
                    typedRoutes: false,
                    nodeMiddleware: false,
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
        ),
    ),
)
