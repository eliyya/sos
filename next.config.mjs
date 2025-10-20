import { withTypeRoute } from '@eliyya/type-routes/next'
import { withTypeCSSModule } from '@eliyya/typed-css-modules'
import createNextIntlPlugin from 'next-intl/plugin'

export default withTypeCSSModule(
    createNextIntlPlugin()(
        withTypeRoute(
            {
                allowedDevOrigins: ['dev.eliyya.dev'],
                // la configuracion de nextjs
                webpack: config => {
                    config.ignoreWarnings = [
                        {
                            message:
                                /Critical dependency: the request of a dependency is an expression/,
                        },
                    ]
                    return config
                },
            },
            {
                definedParams: {},
            },
        ),
    ),
)
