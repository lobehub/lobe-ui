import { TextArea, TextAreaProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const controls: TextAreaProps | any = useControls(
    {
      placeholder: 'Type keywords...',
      resize: false,
      shadow: false,
      variant: {
        options: ['outlined', 'borderless', 'filled'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <TextArea {...controls} />
    </StoryBook>
  );
};
