import { ColorSwatches, type ColorSwatchesProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useTheme } from 'antd-style';

export default () => {
  const theme = useTheme();
  const store = useCreateStore();

  const controls = useControls(
    {
      enableColorPicker: false,
      enableColorSwatches: true,
      gap: {
        step: 1,
        value: 6,
      },
      shape: {
        options: ['circle', 'square'],
        value: 'circle',
      },
      size: {
        step: 1,
        value: 24,
      },
    },
    {
      store,
    },
  ) as ColorSwatchesProps;

  return (
    <StoryBook levaStore={store}>
      <ColorSwatches
        {...controls}
        colors={[
          {
            color: 'rgba(0, 0, 0, 0)',
            title: 'Default',
          },
          {
            color: theme.red,
            title: 'Red',
          },
          {
            color: theme.orange,
            title: 'Orange',
          },
          {
            color: theme.gold,
            title: 'Gold',
          },
          {
            color: theme.yellow,
            title: 'Yellow',
          },
          {
            color: theme.lime,
            title: 'Lime',
          },
          {
            color: theme.green,
            title: 'Green',
          },
          {
            color: theme.cyan,
            title: 'Cyan',
          },
          {
            color: theme.blue,
            title: 'Blue',
          },
          {
            color: theme.geekblue,
            title: 'Geekblue',
          },
          {
            color: theme.purple,
            title: 'Purple',
          },
          {
            color: theme.magenta,
            title: 'Magenta',
          },
          {
            color: theme.volcano,
            title: 'Volcano',
          },
        ]}
        onChange={(color) => console.log(color)}
      />
    </StoryBook>
  );
};
