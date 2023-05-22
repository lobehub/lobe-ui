import { Icon, IconProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';
import { Settings } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const size: IconProps['size'] | any = useControls(
    {
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
    },
    { store },
  );
  return (
    <StroyBook levaStore={store}>
      <Icon icon={Settings} size={size} />
    </StroyBook>
  );
};
