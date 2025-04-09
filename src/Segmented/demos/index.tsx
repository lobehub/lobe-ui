import { Icon, Segmented, type SegmentedProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Moon, Sun } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      glass: false,
      shadow: false,
      shape: {
        options: ['default', 'round'],
        value: 'default',
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as SegmentedProps;

  return (
    <StoryBook levaStore={store}>
      <Segmented
        {...control}
        onChange={(value) => {
          console.log(value);
        }}
        options={[
          {
            icon: <Icon icon={Moon} />,
            label: 'Option 1',
            value: 'option1',
          },
          {
            icon: <Icon icon={Sun} />,
            label: 'Option 2',
            value: 'option2',
          },
        ]}
      />
    </StoryBook>
  );
};
