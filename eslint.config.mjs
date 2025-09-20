import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'

/**
 * @type {import('eslint').Linter.Config[]}
 */
const eslintConfig = [
    ...new FlatCompat({
        baseDirectory: import.meta.dirname,
    }).extends('next/core-web-vitals', 'next/typescript', 'prettier'),
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
        ],
    },
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
            'import/no-self-import': 'error',
        },
    },
]

export default eslintConfig
