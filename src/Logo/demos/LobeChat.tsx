import { StoryBook, useControls, useCreateStore } from '@unitalkai/ui';

import { LobeChat, LobeChatProps } from '@/brand';

export default () => {
  const store = useCreateStore();
  const control: LobeChatProps | any = useControls(
    {
      size: {
        max: 240,
        min: 16,
        step: 4,
        value: 64,
      },
      type: {
        options: ['3d', 'flat', 'mono', 'text', 'combine'],
        value: 'combine',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <LobeChat {...control} />
    </StoryBook>
  );
};
