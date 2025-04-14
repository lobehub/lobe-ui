import { Button, Form, FormModal } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

import { items } from './data';

const { useForm } = Form;

// @ts-ignore
const [formItem1, formItem2] = items;

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
  const [form] = useForm();

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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <StoryBook levaStore={store}>
      <Button onClick={showModal} type="primary">
        Open Modal
      </Button>
      <Form.Provider
        onFormFinish={(_, { values }) => {
          setLoading(true);
          console.table(values);
          setTimeout(() => {
            setLoading(false);
            setIsModalOpen(false);
          }, 2000);
        }}
      >
        <FormModal
          form={form}
          initialValues={setting}
          onCancel={handleCancel}
          open={isModalOpen}
          submitLoading={loading}
          title="Form Modal"
        >
          <Form
            form={form}
            itemMinWidth={'max(30%,240px)'}
            items={[formItem1]}
            itemsType={'group'}
            variant={variant}
          />
          <Form
            form={form}
            itemMinWidth={'max(30%,240px)'}
            items={[formItem2]}
            itemsType={'group'}
            variant={variant}
          />
        </FormModal>
      </Form.Provider>
    </StoryBook>
  );
};
