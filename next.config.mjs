import { withTypeRoute } from '@eliyya/type-routes/next'
import { withTypeCSSModule } from '@eliyya/typed-css-modules'
import createNextIntlPlugin from 'next-intl/plugin'

export default withTypeCSSModule(
    createNextIntlPlugin()(
        withTypeRoute(
            {
                // la configuracion de nextjs
                allowedDevOrigins: ['dev.eliyya.dev'],
                cacheComponents: true,
                reactCompiler: true,
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
