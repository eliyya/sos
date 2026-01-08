import { getRequestConfig } from 'next-intl/server'
import es from '../../locales/es.json' with { type: 'json' }
import { BaseMessage } from './types'

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = (await requestLocale) || 'es'
    let messages = es as BaseMessage

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
