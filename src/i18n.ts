import { getRequestConfig } from 'next-intl/server'
import es from '../locales/es.json' with { type: 'json' }

export default getRequestConfig(async () => {
    const locale = 'es'

    return {
        locale,
        messages: es,
    }
})

type Messages = typeof es

declare global {
    // Use type safe message keys with `next-intl`
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntlMessages extends Messages {}
}
