import { ActionIconGroupProps, GuideCard } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: ActionIconGroupProps | any = useControls(
    {
      closable: true,
      cover:
        'https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/convenience-store.webp',
      desc: 'Description',
      shadow: false,
      title: 'Title',
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
      width: 200,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <GuideCard {...control} />
    </StoryBook>
  );
};
