import { Snippet, SnippetProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: SnippetProps | any = useControls(
    {
      children: 'pnpm install @lobehub/ui',
      copyable: true,
      language: 'sh',
      prefix: '$',
      shadow: false,
      spotlight: false,
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Snippet {...control} />
    </StoryBook>
  );
};
