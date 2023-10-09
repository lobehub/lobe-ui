import { ActionIcon, ActionIconProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { Settings } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const size: ActionIconProps['size'] | any = useControls(
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
      fontSize: {
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
  );

  return (
    <StoryBook levaStore={store}>
      <ActionIcon active icon={Settings} size={size} />
    </StoryBook>
  );
};
