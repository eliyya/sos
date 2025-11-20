import { BaseMessage } from './i18n/types'

declare module 'next-intl' {
    interface AppConfig {
        Messages: BaseMessage
    }
}
