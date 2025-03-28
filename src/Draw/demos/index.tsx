import { Draw, type DrawProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useRef } from 'react';

export default () => {
  const store = useCreateStore();
  const ref = useRef(null);
  const control: DrawProps | any = useControls(
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
      <Draw getContainer={false} sidebar={<div>sidebar</div>} {...control}>
        content
      </Draw>
    </StoryBook>
  );
};
