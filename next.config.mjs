import { withTypeRoute } from '@eliyya/type-routes/next'
import { withTypeCSSModule } from '@eliyya/typed-css-modules'
import createNextIntlPlugin from 'next-intl/plugin'

let config = withTypeCSSModule({
    allowedDevOrigins: ['dev.eliyya.dev'],
    reactCompiler: true,
})
config = createNextIntlPlugin()(config)
config = withTypeRoute(config, {
    definedParams: {
        locale: ['es'],
    },
})

export default config
