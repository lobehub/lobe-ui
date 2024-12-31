import type { FormProps } from '@lobehub/ui';
import { InputNumber, Segmented, Select, Switch } from 'antd';
import { Palette, PanelLeftClose } from 'lucide-react';

export const items: FormProps['items'] = [
  {
    children: [
      {
        children: (
          <Select
            options={[
              {
                label: 'English',
                value: 'en',
              },
              {
                label: '简体中文',
                value: 'zh_CN',
              },
            ]}
          />
        ),
        desc: 'Editor language',
        label: 'Language',
        name: 'i18n',
      },
      {
        children: <Switch />,
        desc: 'Reduce the blur effect and background flow color, which can improve smoothness and save CPU usage',
        label: 'Reduce Animation',
        minWidth: undefined,
        name: 'liteAnimation',
        valuePropName: 'checked',
      },
    ],
    icon: Palette,
    key: 'theme',
    title: 'Theme Settings',
  },
  {
    children: [
      {
        children: <Switch />,
        desc: 'Whether to expand the sidebar by default when starting',
        label: 'Default Expand',
        minWidth: undefined,
        name: 'sidebarExpand',
        valuePropName: 'checked',
      },
      {
        children: (
          <Segmented
            options={[
              {
                label: 'Fixed',
                value: 'fixed',
              },
              {
                label: 'Float',
                value: 'float',
              },
            ]}
          />
        ),
        desc: 'Fixed as grid mode for constant display, auto-expand when the mouse moves to the side in floating mode',
        label: 'Display Mode',
        minWidth: undefined,
        name: 'sidebarFixedMode',
      },
      {
        children: <InputNumber />,
        desc: 'Default width of the sidebar when starting',
        label: 'Default Width',
        minWidth: undefined,
        name: 'sidebarWidth',
      },
    ],
    icon: PanelLeftClose,
    key: 'sidebar',
    title: 'Quick Setting Sidebar',
  },
];
