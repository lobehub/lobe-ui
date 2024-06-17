import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';

import { LobeHub, LobeHubProps } from '@/brand';

export default () => {
  const store = useCreateStore();
  const control: LobeHubProps | any = useControls(
    {
      size: {
        max: 240,
        min: 16,
        step: 4,
        value: 64,
      },
      type: {
        options: ['3d', 'flat', 'mono', 'text', 'combine'],
        value: '3d',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <LobeHub {...control} />
    </StoryBook>
  );
};
