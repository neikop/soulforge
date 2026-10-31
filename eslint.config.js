import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importX from 'eslint-plugin-import-x'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      perfectionist.configs['recommended-natural'],
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'import-x': importX,
      prettier: eslintPluginPrettier,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-unassigned-vars': 'warn',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
      'perfectionist/sort-jsx-props': 'warn',
      'perfectionist/sort-imports': 'warn',
      'perfectionist/sort-named-imports': 'warn',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-objects': 'off',
      'prefer-const': 'error',
      'prettier/prettier': 'warn',
      'react-refresh/only-export-components': 'off',
    },
  },
  eslintConfigPrettier,
])
