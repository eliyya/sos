import app from '@eliyya/type-routes'
import { atomWithStorage } from 'jotai/utils'

export const managementRouteSelected = atomWithStorage<string>(
    'managementRouteSelected',
    app.$locale.dashboard.management.laboratories('es'),
)
