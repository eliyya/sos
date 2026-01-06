# AGENTS.md - Development Guidelines for SOS Laboratory Management System

## Overview

This is a Next.js 16 application for managing computer laboratories (SOS - Sistema de Operación de Salas). It uses Prisma with PostgreSQL, Effect for functional programming, and shadcn/ui for components.

## Build/Lint/Test Commands

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Generate Prisma client (runs automatically on postinstall)
npx prisma generate

# Run database migrations
npx prisma migrate deploy
```

### Lint Commands

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix
npx eslint --fix
```

### Type Check Commands

```bash
# TypeScript type checking
npx tsc --noEmit
```

### Database Commands

```bash
# Create and run migrations
npx prisma migrate dev

# Push schema changes (development only)
npx prisma db push

# Reset database
npx prisma migrate reset

# View database
npx prisma studio

# Seed database
npx tsx src/prisma/seed.ts
```

### Single Test Commands

```
# No test framework currently configured
# TODO: Implement testing framework (Jest/Vitest + Playwright for E2E)
```

### Localization Commands

```bash
# Watch i18n type generation
npm run locales
```

### Backup Commands

```bash
# Create database backup
npm run backup:start
```

## Code Style Guidelines

### Project Structure

```
src/
├── actions/          # Server actions (Next.js)
├── app/             # Next.js app router pages
├── components/      # React components
│   ├── ui/         # shadcn/ui components (do not modify)
│   └── ...         # Custom components
├── contexts/       # React contexts for state management
├── constants/      # Application constants
├── env/           # Environment configuration
├── errors/        # Custom error classes
├── hooks/         # Custom React hooks
├── layers/        # Effect layers for dependency injection
├── lib/           # Utility libraries
├── prisma/        # Database schema and migrations
├── services/      # Business logic (Effect-based)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

### TypeScript Configuration

- **Target**: ES2024
- **Strict mode**: Enabled
- **Module resolution**: Bundler (Next.js)
- **Path mapping**: `@/*` maps to `./src/*`
- **JSX**: react-jsx
- **No explicit any**: Preferred, but some legacy code uses `any`

### Import Style

```typescript
// 1. React imports
import { useEffect, useState } from 'react'

// 2. Third-party libraries (alphabetical)
import { Effect } from 'effect'
import { useParams } from 'next/navigation'

// 3. Internal imports (use @/ aliases)
import { PERMISSIONS_FLAGS } from '@/bitfields/PermissionsBitField'
import { AuthLive } from '@/layers/auth.layer'

// 4. Relative imports (only when necessary)
import { prisma } from '../lib/prisma'

// Separate groups with blank lines
// Use named imports over default imports when possible
```

### Naming Conventions

#### Files and Directories

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Services**: camelCase with descriptive names (`userService.ts`)
- **Actions**: camelCase with descriptive names (`createUser.ts`)
- **Contexts**: PascalCase with `Context` suffix (`UserContext.tsx`)
- **Types**: PascalCase (`User.ts`)
- **Utils**: camelCase (`dateUtils.ts`)

#### Variables and Functions

- **Constants**: SCREAMING_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Functions**: camelCase (`getUserById`)
- **Components**: PascalCase (`UserCard`)
- **Hooks**: camelCase with `use` prefix (`useUserData`)
- **Effect functions**: camelCase with `Effect` suffix (`createUserEffect`)

#### Database

- **Tables**: snake_case (`user_permissions`)
- **Columns**: snake_case (`created_at`, `user_id`)
- **Enums**: SCREAMING_SNAKE_CASE (`STATUS_ACTIVE`)

### Effect.ts Patterns

Use Effect.ts for functional programming in services:

```typescript
export const createUserEffect = (userData: UserInput) =>
    Effect.gen(function* (_) {
        // Validate permissions
        yield* _(requirePermission(PERMISSIONS_FLAGS.CREATE_USER))

        // Get dependencies
        const prisma = yield* _(PrismaService)

        // Business logic with error handling
        const user = yield* _(
            Effect.tryPromise({
                try: () => prisma.user.create({ data: userData }),
                catch: err => new PrismaError(err),
            }),
        )

        return user
    })
```

### Server Actions Pattern

```typescript
'use server'

export async function createUserAction(input: UserInput) {
    return await Effect.runPromise(
        Effect.scoped(
            createUserEffect(input)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: user => ({ status: 'success', data: user }),
                        onFailure: error => ({
                            status: 'error',
                            error: error.message,
                        }),
                    }),
                ),
        ),
    )
}
```

### Error Handling

- Use custom error classes from `@/errors`
- Effect services should use `Effect.fail()` for errors
- Server actions should return structured error responses
- Client components should handle errors gracefully with user feedback

### Component Patterns

#### Context Providers

```tsx
'use client'

export const UserContext = createContext<UserContextType>(undefined!)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
```

#### Custom Hooks

```tsx
export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within UserProvider')
    }
    return context
}
```

### State Management

- **Server state**: Effect + Prisma in services
- **Client state**: React Context + useState/useReducer
- **Global state**: Zustand (for complex cross-component state)
- **URL state**: nuqs (for search params and filters)

### Database Patterns

- Use Prisma's generated types
- Prefer transactions for multi-table operations
- Use soft deletes with `STATUS` enum (ACTIVE/ARCHIVED/DELETED)
- Implement proper foreign key relationships

### Authentication & Authorization

- Use Better Auth for authentication
- Custom permission system with bitfields
- Check permissions in Effect services using `requirePermission()`

### Internationalization (i18n)

- Use next-intl for localization
- Locale files in `/locales` directory
- Spanish as primary language (`es.json`)

### UI/UX Guidelines

- Use shadcn/ui components from `/components/ui`
- Follow Tailwind CSS utility-first approach
- Implement proper loading states and error boundaries
- Use consistent spacing and typography
- Implement responsive design patterns

### Security Best Practices

- Validate all inputs using Zod schemas
- Use parameterized queries (Prisma handles this)
- Implement proper CORS configuration
- Never log sensitive information
- Use environment variables for secrets
- Implement rate limiting where appropriate

### Performance Considerations

- Use Next.js Image component for images
- Implement proper code splitting
- Use React.memo for expensive components
- Optimize database queries with proper includes/selects
- Implement caching strategies where appropriate

### Git Workflow

- Use conventional commits
- Create feature branches from main
- Use pull requests for code review
- CI/CD runs on main branch pushes and PRs
- Vercel deployments are automatic

## Technical Debt Areas to Address

### High Priority

1. **ESLint Errors**: Fix 5 critical ESLint errors (setState in effects, explicit any usage)
2. **TypeScript Errors**: Resolve module resolution issues (`@/prisma/client/browser`)
3. **Missing Tests**: Implement comprehensive test suite (unit, integration, e2e)
4. **Unused Imports**: Clean up 13+ unused import warnings

### Medium Priority

1. **Code Comments**: Add JSDoc comments to complex functions
2. **Error Boundaries**: Implement React error boundaries
3. **Loading States**: Add proper loading UI patterns
4. **Accessibility**: Implement ARIA labels and keyboard navigation

### Low Priority

1. **Performance**: Implement React.memo and useMemo optimizations
2. **Bundle Analysis**: Set up bundle size monitoring
3. **Documentation**: Expand README with architecture overview
4. **Monitoring**: Implement error tracking and analytics

## Development Environment Setup

1. **Node.js**: v22.11.0 or higher
2. **PostgreSQL**: Latest stable version
3. **VS Code Extensions**:
    - Prettier
    - ESLint
    - Prisma
    - Tailwind CSS IntelliSense
    - TypeScript Importer

4. **Environment Variables**: Copy `.env.example` to `.env.local`

## Deployment

- **Platform**: Vercel
- **Database**: PostgreSQL (managed)
- **CDN**: Vercel CDN for static assets
- **Monitoring**: Sentry for error tracking

## Communication

- Use GitHub Issues for bug reports and feature requests
- Use pull requests for code changes
- Follow conventional commit messages
- Document breaking changes in PR descriptions</content>
  <parameter name="filePath">C:\Users\tecno\code\sos\AGENTS.md
