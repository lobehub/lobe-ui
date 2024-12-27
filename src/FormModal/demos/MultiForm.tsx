import { Form, FormModal } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Button, InputNumber, Segmented, Select, Switch } from 'antd';
import { useState } from 'react';

const { useForm } = Form;
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

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      form.submit();
      setLoading(false);
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
      <Form.Provider
        onFormFinish={(_, { values }) => {
          console.table(values);
        }}
      >
        <FormModal
          form={form}
          initialValues={setting}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          open={isModalOpen}
          submitLoading={loading}
          title="Form Modal"
        >
          <Form
            form={form}
            itemMinWidth={'max(30%,240px)'}
            items={[
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
                title: 'Theme Settings',
              },
            ]}
            itemsType={'group'}
            variant={variant}
          />
          <Form
            form={form}
            itemMinWidth={'max(30%,240px)'}
            items={[
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
                title: 'Quick Setting Sidebar',
              },
            ]}
            itemsType={'group'}
            variant={variant}
          />
        </FormModal>
      </Form.Provider>
    </StoryBook>
  );
};
