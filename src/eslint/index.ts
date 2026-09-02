const DEPRECATED_UI_COMPONENTS = [
  'ActionIcon',
  'Alert',
  'AutoComplete',
  'Avatar',
  'Button',
  'Checkbox',
  'CheckboxGroup',
  'Drawer',
  'Dropdown',
  'FormSubmitFooter',
  'FormTitle',
  'InputOPT',
  'Modal',
  'Radio',
  'RadioGroup',
  'Segmented',
  'Select',
  'Skeleton',
  'SkeletonAvatar',
  'SkeletonBlock',
  'SkeletonButton',
  'SkeletonParagraph',
  'SkeletonTags',
  'SkeletonTitle',
  'Slider',
  'SliderWithInput',
  'Switch',
  'Tabs',
  'Tag',
  'Text',
];

const DEPRECATED_ANTD_COMPONENT_PATHS = [
  'antd/es/alert',
  'antd/es/alert/*',
  'antd/es/auto-complete',
  'antd/es/auto-complete/*',
  'antd/es/checkbox',
  'antd/es/checkbox/*',
  'antd/es/dropdown',
  'antd/es/dropdown/*',
  'antd/es/message',
  'antd/es/message/*',
  'antd/es/notification',
  'antd/es/notification/*',
  'antd/es/radio',
  'antd/es/radio/*',
  'antd/es/skeleton',
  'antd/es/skeleton/*',
  'antd/es/slider',
  'antd/es/slider/*',
  'antd/es/switch',
  'antd/es/switch/*',
  'antd/lib/alert',
  'antd/lib/alert/*',
  'antd/lib/auto-complete',
  'antd/lib/auto-complete/*',
  'antd/lib/checkbox',
  'antd/lib/checkbox/*',
  'antd/lib/dropdown',
  'antd/lib/dropdown/*',
  'antd/lib/message',
  'antd/lib/message/*',
  'antd/lib/notification',
  'antd/lib/notification/*',
  'antd/lib/radio',
  'antd/lib/radio/*',
  'antd/lib/skeleton',
  'antd/lib/skeleton/*',
  'antd/lib/slider',
  'antd/lib/slider/*',
  'antd/lib/switch',
  'antd/lib/switch/*',
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
          {
            importNames: ['message', 'notification'],
            message: 'antd feedback APIs are deprecated. Use `toast` from "@lobehub/ui/base-ui".',
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
