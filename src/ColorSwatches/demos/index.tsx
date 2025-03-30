import { ColorSwatches, type ColorSwatchesProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useTheme } from 'antd-style';

export default () => {
  const theme = useTheme();
  const store = useCreateStore();

  const controls: ColorSwatchesProps | any = useControls(
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
  );

  return (
    <StoryBook levaStore={store}>
      <ColorSwatches
        colors={[
          {
            color: 'rgba(0, 0, 0, 0)',
            label: 'Default',
          },
          {
            color: theme.red,
            label: 'Red',
          },
          {
            color: theme.orange,
            label: 'Orange',
          },
          {
            color: theme.gold,
            label: 'Gold',
          },
          {
            color: theme.yellow,
            label: 'Yellow',
          },
          {
            color: theme.lime,
            label: 'Lime',
          },
          {
            color: theme.green,
            label: 'Green',
          },
          {
            color: theme.cyan,
            label: 'Cyan',
          },
          {
            color: theme.blue,
            label: 'Blue',
          },
          {
            color: theme.geekblue,
            namlabele: 'Geekblue',
          },
          {
            color: theme.purple,
            label: 'Purple',
          },
          {
            color: theme.magenta,
            label: 'Magenta',
          },
          {
            color: theme.volcano,
            label: 'Volcano',
          },
        ]}
        onChange={(color) => console.log(color)}
        {...controls}
      />
    </StoryBook>
  );
};
