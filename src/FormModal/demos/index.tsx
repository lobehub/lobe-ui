import { Button, FormModal, type FormProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
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
      <Button onClick={showModal} type="primary">
        Open Modal
      </Button>
      <FormModal
        initialValues={setting}
        itemMinWidth={'max(30%,240px)'}
        items={items}
        itemsType={'group'}
        onCancel={handleCancel}
        onFinish={handleFinish}
        open={isModalOpen}
        submitLoading={loading}
        title="Form Modal"
        variant={variant}
      />
    </StoryBook>
  );
};
