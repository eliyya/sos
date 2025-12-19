import {
    customSessionClient,
    inferAdditionalFields,
    usernameClient,
    adminClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from './auth'

export const authClient = createAuthClient({
    plugins: [
        adminClient(),
        usernameClient(),
        inferAdditionalFields<typeof auth>(),
        customSessionClient<typeof auth>(),
    ],
})
