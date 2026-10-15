import { useTheme } from '@lobehub/ui';
import { GridBackground, type GridBackgroundProps } from '@lobehub/ui/awesome';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import chroma from 'chroma-js';

export default () => {
  const theme = useTheme();
  const store = useCreateStore();
  const control = useControls(
    {
      animation: true,
      backgroundColor: '#001dff',
      colorBack: chroma(theme.colorText).alpha(0.2).css(),
      colorFront: theme.colorText,
      duration: {
        max: 24,
        min: 1,
        step: 1,
        value: 6,
      },
      flip: false,
      random: true,
      reverse: false,
      showBackground: false,
      strokeWidth: {
        max: 10,
        min: 1,
        step: 1,
        value: 3,
      },
    },
    { store },
  ) as GridBackgroundProps;

  return (
    <StoryBook levaStore={store}>
      <GridBackground style={{ width: '100%' }} {...control} />
    </StoryBook>
  );
};
