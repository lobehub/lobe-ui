import { TokenTag, TokenTagProps } from '@lobehub/ui/chat';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      hideText: false,
      maxValue: {
        step: 1,
        value: 5000,
      },
      mode: {
        options: ['remained', 'used'],
        value: 'remained',
      },
      shape: {
        options: ['round', 'square'],
        value: 'round',
      },
      value: {
        step: 1,
        value: 1000,
      },
    },
    { store },
  ) as TokenTagProps;

  return (
    <StoryBook levaStore={store}>
      <TokenTag {...control} />
    </StoryBook>
  );
};
