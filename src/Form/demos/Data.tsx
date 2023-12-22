import { Form, type FormProps } from '@lobehub/ui';
import { Button, InputNumber, Segmented, Select, Switch } from 'antd';
import { Palette, PanelLeftClose } from 'lucide-react';

const setting = {
  i18n: 'en',
  liteAnimation: false,
  sidebarExpand: true,
  sidebarFixedMode: 'float',
  sidebarWidth: 300,
};

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
        name: 'liteAnimation',
        valuePropName: 'checked',
      },
    ],
    icon: Palette,
    title: 'Theme Settings',
  },
  {
    children: [
      {
        children: <Switch />,
        desc: 'Whether to expand the sidebar by default when starting',
        label: 'Default Expand',
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
        name: 'sidebarFixedMode',
      },
      {
        children: <InputNumber />,
        desc: 'Default width of the sidebar when starting',
        label: 'Default Width',
        name: 'sidebarWidth',
      },
    ],
    icon: PanelLeftClose,
    title: 'Quick Setting Sidebar',
  },
];

export default () => {
  return (
    <Form
      footer={
        <>
          <Button htmlType="button">Reset</Button>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </>
      }
      initialValues={setting}
      items={items}
      onFinish={console.table}
    />
  );
};
