// import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'

// /**
//  * @type {import('eslint').Linter.Config[]}
//  */
// const eslintConfig = [
//     ...new FlatCompat({
//         baseDirectory: import.meta.dirname,
//     }).extends('next/core-web-vitals', 'next/typescript', 'prettier'),
//     {
//         ignores: [
//             'node_modules/**',
//             '.next/**',
//             'out/**',
//             'build/**',
//             'next-env.d.ts',
//         ],
//     },
//     {
//         plugins: {
//             import: importPlugin,
//         },
//         rules: {
//             'import/newline-after-import': 'error',
//             'import/no-duplicates': 'error',
//             'import/no-self-import': 'error',
//         },
//     },
// ]

// export default eslintConfig

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
            'import/no-self-import': 'error',
        },
    },
])

export default eslintConfig
