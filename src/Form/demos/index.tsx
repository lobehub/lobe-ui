import { Form, type FormProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

import { items } from '@/Form/demos/data';

const setting = {
  i18n: 'en',
  liteAnimation: false,
  sidebarExpand: true,
  sidebarFixedMode: 'float',
  sidebarWidth: 300,
};

export default () => {
  const store = useCreateStore();
  const [form] = Form.useForm();
  const [data, setData] = useState(setting);

  const controls = useControls(
    {
      collapsible: true,
      variant: {
        options: ['borderless', 'filled', 'outlined'],
        value: 'borderless',
      },
    },
    { store },
  ) as FormProps;

  const handleSubmit = async (values: any) => {
    setData(values);
    console.log('submit:', values);
  };

  return (
    <StoryBook levaStore={store}>
      <Form
        defaultActiveKey={['theme']}
        form={form}
        initialValues={data}
        itemMinWidth={'max(30%,240px)'}
        items={items}
        onCollapse={console.log}
        onFinish={handleSubmit}
        {...controls}
      />
    </StoryBook>
  );
};
