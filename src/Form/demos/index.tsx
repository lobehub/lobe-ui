import { Form } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
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

  const { collapsible, variant }: any = useControls(
    {
      collapsible: true,
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
        collapsible={collapsible}
        defaultActiveKey={['theme']}
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
        onCollapse={console.log}
        onFinish={console.table}
        variant={variant}
      />
    </StoryBook>
  );
};
