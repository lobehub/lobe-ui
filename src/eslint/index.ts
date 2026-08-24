const DEPRECATED_UI_COMPONENTS = [
  'Alert',
  'AutoComplete',
  'Button',
  'Checkbox',
  'CheckboxGroup',
  'Drawer',
  'Modal',
  'Radio',
  'RadioGroup',
  'Segmented',
  'Select',
  'Slider',
  'SliderWithInput',
  'Tabs',
];

const DEPRECATED_ANTD_COMPONENT_PATHS = [
  'antd/es/alert',
  'antd/es/alert/*',
  'antd/es/auto-complete',
  'antd/es/auto-complete/*',
  'antd/es/checkbox',
  'antd/es/checkbox/*',
  'antd/es/radio',
  'antd/es/radio/*',
  'antd/es/slider',
  'antd/es/slider/*',
  'antd/lib/alert',
  'antd/lib/alert/*',
  'antd/lib/auto-complete',
  'antd/lib/auto-complete/*',
  'antd/lib/checkbox',
  'antd/lib/checkbox/*',
  'antd/lib/radio',
  'antd/lib/radio/*',
  'antd/lib/slider',
  'antd/lib/slider/*',
];

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
            message: 'Direct antd import is deprecated. Import from "@lobehub/ui/base-ui" instead.',
            name: 'antd',
          },
        ],
        patterns: [
          {
            group: DEPRECATED_ANTD_COMPONENT_PATHS,
            message:
              'Direct antd component import is deprecated. Import from "@lobehub/ui/base-ui" instead.',
          },
        ],
      },
    ],
  },
};

export default [restrictedImports];
