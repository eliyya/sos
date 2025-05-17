'use client'

export function useDevice() {
    return {
        os: getOS(),
        browser: getBrowser(),
        device: getDevice(),
        model: getModel(),
    }
}

function getBrowser() {
    const userAgent = globalThis.navigator.userAgent.toLowerCase()
    if (userAgent.includes('chrome') && !userAgent.includes('edg'))
        return 'Chrome'
    if (userAgent.includes('firefox')) return 'Firefox'
    if (userAgent.includes('safari') && !userAgent.includes('chrome'))
        return 'Safari'
    if (userAgent.includes('edg')) return 'Edge'
    if (userAgent.includes('opr') || userAgent.includes('opera')) return 'Opera'
    return 'Unknown'
}

function getOS() {
    const userAgent = globalThis.navigator.userAgent.toLowerCase()
    if (userAgent.includes('windows')) return 'Windows'
    if (userAgent.includes('mac')) return 'MacOS'
    if (userAgent.includes('linux')) return 'Linux'
    if (userAgent.includes('android')) return 'Android'
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS'
    return 'Unknown'
}

function getDevice() {
    const userAgent = globalThis.navigator.userAgent.toLowerCase()

    if (/ipad|tablet|playbook|kindle|silk|android(?!.*mobile)/i.test(userAgent))
        return 'Tablet'
    if (/mobi|iphone|ipod|android|blackberry|windows phone/i.test(userAgent))
        return 'Móvil'
    return 'PC'
}

function getModel() {
    const userAgent = globalThis.navigator.userAgent.toLowerCase()

    if (/ipad/i.test(userAgent)) return 'iPad'
    if (/tablet/i.test(userAgent)) return 'Tablet'
    if (/playbook/i.test(userAgent)) return 'Playbook'
    if (/kindle/i.test(userAgent)) return 'Kindle'
    if (/silk/i.test(userAgent)) return 'Silk'
    if (/android/i.test(userAgent)) return 'Android'
    if (/mobi/i.test(userAgent)) return 'Móvil'
    if (/blackberry/i.test(userAgent)) return 'BlackBerry'
    if (/windows phone/i.test(userAgent)) return 'Windows Phone'
    if (/ipod/i.test(userAgent)) return 'iPod'
    if (/iphone/i.test(userAgent)) return 'iPhone'
    return 'Unknown'
}
