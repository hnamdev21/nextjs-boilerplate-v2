import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginImportX from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = tseslint.config(
  {
    ignores: ['.next', 'node_modules', '*.config.mjs', '*.config.js'],
  },
  {
    plugins: {
      prettier,
      simpleImportSort,
      unusedImports,
    },
  },
  // Base
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,

  // Next.js / React
  ...compat.extends('plugin:@next/next/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',

        // Node globals
        process: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': 'error',

      'unusedImports/no-unused-imports': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'simpleImportSort/imports': 'error',
      'simpleImportSort/exports': 'error',

      'no-return-assign': 'error',
      'no-console': 'off',
      'no-param-reassign': 'error',

      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],

      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-for-of': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import-x/no-unresolved': ['error', { ignore: ['@chakra-ui/react'] }],
      // 'import-x/no-named-as-default-member': 'off',
      // 'import-x/no-named-as-default': 'off',
      // '@next/next/no-img-element': 'off',
    },
  },

  {
    files: ['**/*.cjs', '**/*.cts'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },

  prettierConfig
);

export default config;
