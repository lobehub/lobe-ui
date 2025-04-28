import { Form, type FormProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { InputNumber, Segmented, Select, Switch } from 'antd';
import { Palette, PanelLeftClose } from 'lucide-react';
import { useState } from 'react';

const setting = {
  i18n: 'en',
  liteAnimation: false,
  sidebarExpand: true,
  sidebarFixedMode: 'float',
  sidebarWidth: 300,
};

enum ActiveKey {
  Sidebar = 'sidebar',
  Theme = 'theme',
}

export default () => {
  const [active, setActive] = useState<ActiveKey[]>([ActiveKey.Theme, ActiveKey.Sidebar]);

  const store = useCreateStore();

  const { variant }: any = useControls(
    {
      variant: {
        options: ['borderless', 'filled', 'outlined'],
        value: 'borderless',
      },
    },
    { store },
  );

  const items: FormProps['items'] = [
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
      extra: (
        <Switch
          onChange={(v) => {
            setActive((prev) =>
              v ? [...prev, ActiveKey.Theme] : prev.filter((key) => key !== ActiveKey.Theme),
            );
          }}
          value={active.includes(ActiveKey.Theme)}
        />
      ),
      icon: Palette,
      key: ActiveKey.Theme,
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
      extra: (
        <Switch
          onChange={(v) => {
            setActive((prev) =>
              v ? [...prev, ActiveKey.Sidebar] : prev.filter((key) => key !== ActiveKey.Sidebar),
            );
          }}
          value={active.includes(ActiveKey.Sidebar)}
        />
      ),
      icon: PanelLeftClose,
      key: ActiveKey.Sidebar,
      title: 'Quick Setting Sidebar',
    },
  ];

  return (
    <StoryBook levaStore={store}>
      <Form
        activeKey={active}
        initialValues={setting}
        itemMinWidth={'max(30%,240px)'}
        items={items}
        onCollapse={console.log}
        onFinish={console.table}
        variant={variant}
      />
    </StoryBook>
  );
};
