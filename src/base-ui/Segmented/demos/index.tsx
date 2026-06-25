import { Segmented, type SegmentedProps } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { CatIcon, DogIcon, RabbitIcon } from 'lucide-react';

const options: SegmentedProps['options'] = [
  { icon: <CatIcon size={14} />, label: 'Cat', value: 'cat' },
  { icon: <DogIcon size={14} />, label: 'Dog', value: 'dog' },
  { icon: <RabbitIcon size={14} />, label: 'Rabbit', value: 'rabbit' },
];

export default () => {
  const store = useCreateStore();

  const controls = useControls(
    {
      block: false,
      glass: false,
      shadow: false,
      size: {
        options: ['small', 'middle', 'large'],
        value: 'middle',
      },
      variant: {
        options: ['filled', 'outlined'],
        value: 'filled',
      },
      vertical: false,
    },
    { store },
  ) as SegmentedProps;

  return (
    <StoryBook levaStore={store}>
      <Segmented defaultValue="cat" options={options} {...controls} />
    </StoryBook>
  );
};
