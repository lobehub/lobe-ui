import { Form } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

import { items } from '@/Form/demos/data';

const setting = {
  i18n: 'en',
  liteAnimation: false,
};

export default () => {
  const store = useCreateStore();
  const [form] = Form.useForm();
  const [data, setData] = useState(setting);

  const { variant, ...rest }: any = useControls(
    {
      enableReset: true,
      enableUnsavedWarning: true,
      float: true,
      variant: {
        options: ['borderless', 'filled', 'outlined'],
        value: 'borderless',
      },
    },
    { store },
  );

  const handleSubmit = async (values: any) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    setData(values);
    console.log('submit:', values);
  };

  return (
    <StoryBook levaStore={store}>
      <Form
        footer={<Form.SubmitFooter {...rest} />}
        form={form}
        initialValues={data}
        itemMinWidth={'max(30%,240px)'}
        items={(items as any)[0].children}
        itemsType={'flat'}
        onFinish={handleSubmit}
        variant={variant}
      />
    </StoryBook>
  );
};
