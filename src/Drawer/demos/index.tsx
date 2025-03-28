import { Drawer, type DrawerProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useRef } from 'react';

export default () => {
  const store = useCreateStore();
  const ref = useRef(null);
  const control: DrawerProps | any = useControls(
    {
      containerMaxWidth: 1024,
      height: 600,
      noHeader: true,
      open: true,
      placement: {
        options: ['left', 'right', 'top', 'bottom'],
        value: 'bottom',
      },
      title: 'Drawer',
    },
    { store },
  );

  return (
    <StoryBook height={800} levaStore={store} noPadding ref={ref}>
      <Drawer getContainer={false} sidebar={<div>sidebar</div>} {...control}>
        content
      </Drawer>
    </StoryBook>
  );
};
