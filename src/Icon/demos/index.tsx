import { Icon, IconProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';
import * as LucideIcon from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control: IconProps | any = useControls(
    {
      size: {
        value: 'large',
        options: ['large', 'normal', 'small'],
      },
      icon: {
        value: LucideIcon.Settings,
        options: LucideIcon,
      },
      spin: false,
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Icon {...control} />
    </StroyBook>
  );
};
