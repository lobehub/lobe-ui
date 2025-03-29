import { FormModal, type FormProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Button } from 'antd';
import { useState } from 'react';

import { items } from './data';

const setting = {
  i18n: 'en',
  liteAnimation: false,
  sidebarExpand: true,
  sidebarFixedMode: 'float',
  sidebarWidth: 300,
};

export default () => {
  const [data, setData] = useState(setting);
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
        itemsType={'group'}
        onCancel={handleCancel}
        onFinish={handleFinish}
        open={isModalOpen}
        title="Form Modal"
        variant={variant}
      />
    </StoryBook>
  );
};
