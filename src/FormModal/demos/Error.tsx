import { Button, FormModal, type FormProps, InputNumber, Select } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Segmented, Switch } from 'antd';
import { useState } from 'react';

const items: FormProps['items'] = [
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
    rules: [{ required: true }],
  },
  {
    children: <Switch />,
    desc: 'Reduce the blur effect and background flow color, which can improve smoothness and save CPU usage',
    label: 'Reduce Animation',
    minWidth: undefined,
    name: 'liteAnimation',
    valuePropName: 'checked',
  },
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
    rules: [{ message: 'Please input your sidebar width!', required: true }],
  },
];

export default () => {
  const [loading, setLoading] = useState(false);
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleFinish: FormProps['onFinish'] = (v) => {
    setLoading(true);
    console.table(v);
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <StoryBook levaStore={store}>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <FormModal
        itemMinWidth={'max(30%,240px)'}
        items={items}
        itemsType={'flat'}
        open={isModalOpen}
        scrollToFirstError={{ behavior: 'instant', block: 'end', focus: true }}
        submitLoading={loading}
        title="Form Modal"
        variant={variant}
        onCancel={handleCancel}
        onFinish={handleFinish}
      />
    </StoryBook>
  );
};
