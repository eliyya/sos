import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import es from '../../locales/es.json' with { type: 'json' }

export default getRequestConfig(async () => {
    const store = await cookies()
    const locale = store.get('locale')?.value || 'es'
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
