import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const packageEncapsulation = {
  group: ['@saas/*/src', '@saas/*/src/*'],
  message: 'Import workspace packages through their public entry point (e.g. "@saas/ui").',
};

export default [
  { ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/public/mockServiceWorker.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-imports': ['error', { patterns: [packageEncapsulation] }],
    },
  },
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            packageEncapsulation,
            { group: ['@/*', '@saas/admin', '@saas/profile'], message: 'Packages must not import from apps.' },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];