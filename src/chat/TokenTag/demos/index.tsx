import { TokenTag, TokenTagProps } from '@lobehub/ui/chat';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: TokenTagProps | any = useControls(
    {
      maxValue: {
        step: 1,
        value: 5000,
      },
      value: {
        step: 1,
        value: 1000,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <TokenTag {...control} />
    </StoryBook>
  );
};
