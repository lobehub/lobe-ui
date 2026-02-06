import { ActionIcon, type ActionIconProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Settings } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const size = useControls(
    {
      blockSize: {
        max: 100,
        min: 8,
        step: 4,
        value: 40,
      },
      borderRadius: {
        max: 50,
        min: 2,
        step: 2,
        value: 10,
      },
      size: {
        max: 100,
        min: 8,
        step: 4,
        value: 28,
      },
      strokeWidth: {
        max: 2,
        min: 1,
        step: 0.5,
        value: 2,
      },
    },
    { store },
  ) as ActionIconProps['size'];

  return (
    <StoryBook levaStore={store}>
      <ActionIcon active icon={Settings} size={size} />
    </StoryBook>
  );
};
