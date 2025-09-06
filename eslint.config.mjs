import { FlatCompat } from '@eslint/eslintrc'

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
]

export default eslintConfig
