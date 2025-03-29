import { FormModal, type FormProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Button, InputNumber, Segmented, Select, Switch } from 'antd';
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
  const [data, setData] = useState({});
  const store = useCreateStore();

  const { variant }: any = useControls(
    {
      variant: {
        options: ['default', 'block', 'ghost', 'pure'],
        value: 'pure',
      },
    },
    { store },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleFinish: FormProps['onFinish'] = async (v) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    setData(v);
    setIsModalOpen(false);
    console.table(v);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <StoryBook levaStore={store}>
      <Button onClick={showModal} type="primary">
        Open Modal
      </Button>
      <FormModal
        initialValues={data}
        itemMinWidth={'max(30%,240px)'}
        items={items}
        itemsType={'flat'}
        onCancel={handleCancel}
        onFinish={handleFinish}
        open={isModalOpen}
        scrollToFirstError={{ behavior: 'instant', block: 'end', focus: true }}
        title="Form Modal"
        variant={variant}
      />
    </StoryBook>
  );
};
