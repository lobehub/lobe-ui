import { noBaseUiSubpath } from './noBaseUiSubpath';
import { noInlineFormSchema } from './noInlineFormSchema';

export const restrictedImports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            message: 'Use `Spin variant="network"` from "@lobehub/ui" instead.',
            name: 'thinking-orbs',
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
