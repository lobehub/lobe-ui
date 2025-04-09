import { Video, type VideoProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      poster: 'https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp',
      preview: true,
      src: 'https://github.com/lobehub/lobe-chat/assets/28616219/f29475a3-f346-4196-a435-41a6373ab9e2',
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as VideoProps;
  return (
    <StoryBook levaStore={store}>
      <Video {...options} />
    </StoryBook>
  );
};
