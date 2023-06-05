import { ActionIcon, ActionIconProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';
import { Settings } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const size: ActionIconProps['size'] | any = useControls(
    {
      blockSize: {
        value: 40,
        step: 4,
        min: 8,
        max: 100,
      },
      fontSize: {
        value: 28,
        step: 4,
        min: 8,
        max: 100,
      },
      strokeWidth: {
        value: 2,
        step: 0.5,
        min: 1,
        max: 2,
      },
      borderRadius: {
        value: 10,
        step: 2,
        min: 2,
        max: 50,
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <ActionIcon active icon={Settings} size={size} />
    </StroyBook>
  );
};
