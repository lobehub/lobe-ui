import { ColorSwatches, type ColorSwatchesProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { cssVar } from 'antd-style';

export default () => {
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
            color: cssVar.red,
            title: 'Red',
          },
          {
            color: cssVar.orange,
            title: 'Orange',
          },
          {
            color: cssVar.gold,
            title: 'Gold',
          },
          {
            color: cssVar.yellow,
            title: 'Yellow',
          },
          {
            color: cssVar.lime,
            title: 'Lime',
          },
          {
            color: cssVar.green,
            title: 'Green',
          },
          {
            color: cssVar.cyan,
            title: 'Cyan',
          },
          {
            color: cssVar.blue,
            title: 'Blue',
          },
          {
            color: cssVar.geekblue,
            title: 'Geekblue',
          },
          {
            color: cssVar.purple,
            title: 'Purple',
          },
          {
            color: cssVar.magenta,
            title: 'Magenta',
          },
          {
            color: cssVar.volcano,
            title: 'Volcano',
          },
        ]}
        onChange={(color) => console.log(color)}
      />
    </StoryBook>
  );
};
