import { defineConfig } from '@lobehub/eslint-config';
import stylex from '@stylexjs/eslint-plugin';

export default defineConfig(
  {
    ignores: [
      'node_modules',
      'coverage',
      '.coverage',
      'jest*',
      '_test_',
      '__test__',
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
    files: ['src/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              message: 'Use the hooks in src/hooks (useScroll, useSize, useHover).',
              name: 'ahooks',
            },
            { message: 'Use useControlledState from src/hooks.', name: 'use-merge-value' },
            {
              message: 'Use mergeRefs / useMergeRefs from src/utils/mergeRefs.',
              name: 'react-merge-refs',
            },
            { message: 'Use mixColors / withAlpha from src/utils/colorMath.', name: 'polished' },
            { message: 'Data fetching belongs to the app, not the UI library.', name: 'swr' },
            { message: 'Use plain immutable updates.', name: 'immer' },
            { message: 'Use isEqual from es-toolkit/compat.', name: 'fast-deep-equal' },
            { message: 'Use hashString from src/utils/hashString.', name: 'ts-md5' },
            { message: 'Use formatNumber from src/utils/formatNumber.', name: 'numeral' },
            { message: 'Use genCdnUrl or build the URL directly.', name: 'url-join' },
            {
              message: 'Base UI owns positioning; declare the types you need locally.',
              name: '@floating-ui/react',
            },
            ...[
              '@emotion/is-prop-valid',
              '@mdx-js/react',
              '@radix-ui/react-slot',
              'class-variance-authority',
              'hast-util-to-jsx-runtime',
              'html-url-attributes',
              'marked',
              'query-string',
              'react-rnd',
              'react-zoom-pan-pinch',
              'remark-github',
              'remend',
              'uuid',
            ].map((name) => ({ message: 'Removed from @lobehub/ui dependencies in v6.', name })),
          ],
          patterns: [{ group: ['ahooks/*'], message: 'Use the hooks in src/hooks.' }],
        },
      ],
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
  {
    // React Router framework mode requires default exports from route modules,
    // root, server entry, and the route config; the .d.ts mirrors a virtual
    // module's default export shape; home page components must default-export
    // to satisfy the virtual:lobedocs/home-page module contract.
    files: [
      'packages/docs-kit/site/app/routes/*.tsx',
      'packages/docs-kit/site/root.tsx',
      'packages/docs-kit/site/entry.server.tsx',
      'packages/docs-kit/site/routes.ts',
      'packages/docs-kit/site/types/*.d.ts',
      'packages/docs-kit/site/components/Home/DefaultHome.tsx',
      'docs/home/home.tsx',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['src/**/style*.ts', 'src/styles/stylex/**'],
    plugins: { '@stylexjs': stylex },
    rules: {
      '@stylexjs/no-unused': 'error',
      '@stylexjs/sort-keys': 'error',
      '@stylexjs/valid-shorthands': 'error',
      '@stylexjs/valid-styles': 'error',
      'no-restricted-syntax': [
        'error',
        {
          message: 'Default export is not allowed. Use named exports instead.',
          selector: 'ExportDefaultDeclaration',
        },
        {
          message:
            'StyleX 0.19 silently drops this shorthand; use longhands (backgroundColor, animationName, borderWidth/borderStyle/borderColor).',
          selector:
            "CallExpression[callee.object.name='stylex'][callee.property.name='create'] Property[key.name=/^(animation|background|border)$/], CallExpression[callee.object.name='stylex'][callee.property.name='create'] Property[key.value=/^(animation|background|border)$/]",
        },
      ],
    },
  },
);
