import { createAuthClient } from 'better-auth/react'
import {
    customSessionClient,
    inferAdditionalFields,
    usernameClient,
} from 'better-auth/client/plugins'
import type { auth } from './auth'

export const authClient = createAuthClient({
    plugins: [
        usernameClient(),
        inferAdditionalFields({
            user: {
                role_id: {
                    type: 'string',
                    input: true,
                },
            },
        }),
        customSessionClient<typeof auth>(),
    ],
})
