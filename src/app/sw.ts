import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
    }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
    precacheEntries: [
        ...(self.__SW_MANIFEST ?? []),
        '/dashboard/properties/all/edit',
    ],
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [...defaultCache],
})

self.addEventListener('fetch', async event => {
    const url = new URL(event.request.url)
    if (url.pathname.match(/^\/dashboard\/properties\/[^/]\/edit/)) {
        console.log(event.request)
        const r = await serwist.matchPrecache('/dashboard/properties/all/edit')
        console.log(r)
        event.respondWith(r ?? fetch(event.request))
    }
})

serwist.addEventListeners()
