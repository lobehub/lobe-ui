import { Form, StoryBook, useControls, useCreateStore } from '@unitalkai/ui';
import { Button } from 'antd';

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

  const { variant }: any = useControls(
    {
      variant: {
        options: ['default', 'block', 'ghost', 'pure'],
        value: 'default',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
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
        itemMinWidth={'max(30%,240px)'}
        items={items}
        onFinish={console.table}
        variant={variant}
      />
    </StoryBook>
  );
};
