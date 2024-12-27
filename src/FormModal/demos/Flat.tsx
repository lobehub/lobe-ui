import { FormModal, type FormProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Button, Select, Switch } from 'antd';
import { useState } from 'react';

const setting = {
  i18n: 'en',
  liteAnimation: false,
  sidebarExpand: true,
  sidebarFixedMode: 'float',
  sidebarWidth: 300,
};

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
  },
  {
    children: <Switch />,
    desc: 'Reduce the blur effect and background flow color, which can improve smoothness and save CPU usage',
    label: 'Reduce Animation',
    minWidth: undefined,
    name: 'liteAnimation',
    valuePropName: 'checked',
  },
];

export default () => {
  const [loading, setLoading] = useState(false);
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
      <Button onClick={showModal} type="primary">
        Open Modal
      </Button>
      <FormModal
        finishLoading={loading}
        initialValues={setting}
        itemMinWidth={'max(30%,240px)'}
        items={items}
        itemsType={'flat'}
        onCancel={handleCancel}
        onFinish={handleFinish}
        open={isModalOpen}
        title="Form Modal"
        variant={variant}
      />
    </StoryBook>
  );
};
