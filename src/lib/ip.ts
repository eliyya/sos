export async function getMyIp() {
    try {
        const request = await fetch('https://api.myip.com')
        const response = await request.json()
        return response as {
            /**
             * IP address
             */
            ip: string
            /**
             * IP country location in English language
             */
            country: string
            /**
             * Two-letter country code in ISO 3166-1 alpha-2 format
             */
            cc: string
        }
    } catch (err) {
        console.log((err as Error).stack)
        return { ip: '192.168.1.1' }
    }
}
