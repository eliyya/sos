import { withTypeRoute } from '@eliyya/type-routes/next'
import { withTypeCSSModule } from '@eliyya/typed-css-modules'
import createNextIntlPlugin from 'next-intl/plugin'

export default withTypeCSSModule(
    createNextIntlPlugin('./src/i18n.ts')(
        withTypeRoute({
            // extraRoutes: ['/test'],
        }),
    ),
)
