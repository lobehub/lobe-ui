import { Image, type ImageProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      alt: 'Image',
      preview: true,
      src: 'https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/1f5bc-fe0f.webp',
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as ImageProps;
  return (
    <StoryBook levaStore={store}>
      <Image {...options} />
    </StoryBook>
  );
};
