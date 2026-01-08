# Uso correcto de next-intl en Server vs Client Components

## Server Components (getTranslations)

Los Server Components usan `getTranslations` de `next-intl/server`:

```typescript
import { getTranslations } from 'next-intl/server'

// En Server Component con params
export default async function MyPage({
    params: { locale },
}: {
    params: { locale: string }
}) {
    const t = await getTranslations('namespace') // o 'namespace.key'

    // Para metadata
    export async function generateMetadata({
        params: { locale },
    }: {
        params: { locale: string }
    }) {
        const t = await getTranslations({ locale, namespace: 'namespace' })
        return { title: t('title') }
    }
}

// O con locale explícito
const t = await getTranslations({ locale, namespace: 'dashboard' })
```

## Client Components (useTranslations)

Los Client Components usan el hook `useTranslations`:

```typescript
'use client'

import { useTranslations } from 'next-intl'

export function MyComponent() {
    const t = useTranslations('namespace') // o sin namespace para acceso global

    // Uso
    return <h1>{t('title')}</h1>
}
```

## Patrones Implementados

### 1. Server Components

- **Página principal**: `src/app/[locale]/dashboard/page.tsx` ✅
- **Páginas de gestión**: Users, Laboratories, Careers, Classes ✅
- **Metadata functions**: `generateMetadata()` ✅

### 2. Client Components

- **Formularios**: Dialogs, forms, inputs ✅
- **Navegación**: Nav components ✅
- **Componentes interactivos**: Tables, buttons, switches ✅

### 3. Namespace Strategy

- **`dashboard`**: Textos del panel principal
- **`users`**: Gestión de usuarios
- **`laboratories`**: Gestión de laboratorios
- **`common`**: Textos reutilizables (botones, errores)
- **`validation`**: Mensajes de validación
- **`nav`**: Navegación
- **`management`**: Sub-navegación de gestión

### 4. Convenciones Seguidas

#### Server Components:

```typescript
// ✅ Correcto
export default async function Page({
    params: { locale },
}: {
    params: { locale: string }
}) {
    const t = await getTranslations('dashboard')
    // ...
}

// ❌ Incorrecto
const t = useTranslations('dashboard') // Hook no válido en Server Component
```

#### Client Components:

```typescript
// ✅ Correcto
'use client'
export function Component() {
    const t = useTranslations('users')
    // ...
}

// ❌ Incorrecto
const t = await getTranslations('users') // Async no válido en Client Component
```

## Archivos Actualizados Exitosamente

### Server Components (getTranslations):

- ✅ `src/app/[locale]/dashboard/page.tsx`
- ✅ `src/app/[locale]/dashboard/management/users/page.tsx`
- ✅ `src/app/[locale]/dashboard/management/laboratories/page.tsx`
- ✅ `src/app/[locale]/dashboard/management/careers/page.tsx`
- ✅ `src/app/[locale]/dashboard/management/classes/page.tsx`

### Client Components (useTranslations):

- ✅ `src/app/[locale]/dashboard/components/DashboardNav.tsx`
- ✅ `src/app/[locale]/dashboard/components/management-link.tsx`
- ✅ Todos los formularios de usuarios (CreateDialog, DeleteDialog, etc.)
- ✅ Todos los formularios de laboratorios
- ✅ Componentes de CC (RegisterVisitForm, etc.)
- ✅ Componentes de auth (LoginForm)

## Mejoras Aplicadas

1. **Tipado correcto**: Se generaron tipos TypeScript para todas las claves
2. **Namespaces organizados**: Estructura lógica de traducciones
3. **Consistencia**: Mismo patrón en todos los componentes
4. **Performance**: Uso eficiente de caché de next-intl
5. **Mantenibilidad**: Código limpio y predecible

## Estado Final

La implementación está completa y sigue las mejores prácticas de next-intl para Next.js 16 con App Router.
