import { Icon, IconProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';
import { Settings } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const size: IconProps['size'] | any = useControls(
    {
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
    <StroyBook levaStore={store}>
      <Icon icon={Settings} size={size} />
    </StroyBook>
  );
};
