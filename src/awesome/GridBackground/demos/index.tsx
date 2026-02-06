import { GridBackground, type GridBackgroundProps } from '@lobehub/ui/awesome';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useTheme } from 'antd-style';
import { rgba } from 'polished';

export default () => {
  const theme = useTheme();
  const store = useCreateStore();
  const control = useControls(
    {
      animation: true,
      backgroundColor: '#001dff',
      colorBack: rgba(theme.colorText, 0.2),
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
