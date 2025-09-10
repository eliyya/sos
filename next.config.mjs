import { withTypeRoute } from '@eliyya/type-routes/next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withTypeCSSModule } from '@eliyya/typed-css-modules'

export default withTypeCSSModule(
    createNextIntlPlugin('./src/i18n.ts')(
        withTypeRoute({
            extraRoutes: ['/test'],
        }),
    ),
)
