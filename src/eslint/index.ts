const DEPRECATED_UI_COMPONENTS = ['Button', 'Modal', 'Segmented', 'Select', 'Tabs'];

export const restrictedImports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            importNames: DEPRECATED_UI_COMPONENTS,
            message:
              'The antd-based wrapper is deprecated. Import from "@lobehub/ui/base-ui" instead.',
            name: '@lobehub/ui',
          },
          {
            importNames: ['createStyles'],
            message:
              '`createStyles` is banned in this project. Use `createStaticStyles` from "antd-style" instead.',
            name: 'antd-style',
          },
          {
            importNames: DEPRECATED_UI_COMPONENTS,
            message:
              'Direct antd import is deprecated. Import from "@lobehub/ui" or "@lobehub/ui/base-ui" instead.',
            name: 'antd',
          },
        ],
      },
    ],
  },
};

export default [restrictedImports];
