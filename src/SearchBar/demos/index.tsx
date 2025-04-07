import { SearchBar, SearchBarProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const controls: SearchBarProps | any = useControls(
    {
      enableShortKey: true,
      loading: false,
      placeholder: 'Type keywords...',
      shadow: false,
      shortKey: 'f',
      spotlight: false,
      variant: {
        options: ['outlined', 'borderless', 'filled'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <SearchBar {...controls} />
    </StoryBook>
  );
};
