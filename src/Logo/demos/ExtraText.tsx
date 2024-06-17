import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';

import { LobeHub, LobeHubProps } from '@/brand';

export default () => {
  const store = useCreateStore();
  const control: LobeHubProps | any = useControls(
    {
      extra: 'UI',
      size: {
        max: 240,
        min: 16,
        step: 4,
        value: 64,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <LobeHub type="combine" {...control} />
    </StoryBook>
  );
};
