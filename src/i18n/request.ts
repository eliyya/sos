import { getRequestConfig } from 'next-intl/server'
import es from '../../locales/es.json' with { type: 'json' }

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = (await requestLocale) || 'es'
    let messages = es

    try {
        messages = (await import(`../../locales/${locale}.json`)).default
    } catch {
        // Ignore
    }

    return {
        locale,
        messages,
    }
})
