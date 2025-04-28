import { Drawer, type DrawerProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useRef } from 'react';

export default () => {
  const store = useCreateStore();
  const ref = useRef(null);
  const control = useControls(
    {
      containerMaxWidth: {
        step: 1,
        value: 1024,
      },
      height: {
        step: 1,
        value: 600,
      },
      noHeader: true,
      open: true,
      placement: {
        options: ['left', 'right', 'top', 'bottom'],
        value: 'bottom',
      },
      title: 'Drawer',
    },
    { store },
  ) as DrawerProps;

  return (
    <StoryBook height={800} levaStore={store} noPadding ref={ref}>
      <Drawer getContainer={false} {...control}>
        {Array.from({ length: 50 })
          .fill('')
          .map((_, i) => (
            <div key={i}>content</div>
          ))}
      </Drawer>
    </StoryBook>
  );
};
