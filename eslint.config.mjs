import { defineConfig } from '@lobehub/eslint-config';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';

export default defineConfig(
  {
    ignores: [
      'node_modules',
      'coverage',
      '.coverage',
      'jest*',
      '_test_',
      '__test__',
      '.umi',
      '.umi-production',
      '.umi-test',
      '.dumi/tmp*',
      '!.dumirc.ts',
      'dist',
      'es',
      'lib',
      'logs',
    ],
    regexp: false,
    react: true,
    typescript: true,
  },
  {
    rules: {
      'no-undef': 'off',
      '@eslint-react/jsx-key-before-spread': 'off',
      '@eslint-react/no-children-only': 'off',
      '@eslint-react/no-children-to-array': 'off',
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/no-nested-component-definitions': 'off',
      '@eslint-react/no-unnecessary-use-prefix': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
      'import-x/consistent-type-specifier-style': 'off',
      'unicorn/better-regex': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
    },
  },
  {
    plugins: {
      'sort-keys-fix': sortKeysFix,
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },
);
