import { noBaseUiSubpath } from './noBaseUiSubpath';
import { noInlineFormSchema } from './noInlineFormSchema';

const REMOVED_ANTD_MESSAGE =
  '@lobehub/ui no longer ships antd. Import components from "@lobehub/ui" (feedback: `toast`).';

export const restrictedImports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          { message: REMOVED_ANTD_MESSAGE, name: 'antd' },
          {
            message:
              'Import createStaticStyles / cssVar / cx / css / keyframes / responsive / useTheme / useThemeMode / useResponsive from "@lobehub/ui" instead of antd-style.',
            name: 'antd-style',
          },
          {
            message: 'Use `Spin variant="network"` from "@lobehub/ui" instead.',
            name: 'thinking-orbs',
          },
        ],
        patterns: [
          { group: ['antd/*', 'rc-*', '@rc-component/*'], message: REMOVED_ANTD_MESSAGE },
          {
            group: ['@ant-design/*'],
            message: '@ant-design packages are not part of the @lobehub/ui stack anymore.',
          },
        ],
      },
    ],
  },
};

const plugin = {
  rules: {
    'no-base-ui-subpath': noBaseUiSubpath,
    'no-inline-form-schema': noInlineFormSchema,
  },
};

export const subpathRules = {
  plugins: { '@lobehub/ui': plugin },
  rules: {
    '@lobehub/ui/no-base-ui-subpath': 'error',
  },
};

export const formSchemaRules = {
  plugins: { '@lobehub/ui': plugin },
  rules: {
    '@lobehub/ui/no-inline-form-schema': 'warn',
  },
};

export default [restrictedImports, subpathRules, formSchemaRules];
