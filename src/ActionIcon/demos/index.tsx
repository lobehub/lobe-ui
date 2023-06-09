import { ActionIcon, ActionIconProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';
import { folder } from 'leva';
import * as LucideIcon from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control: ActionIconProps | any = useControls(
    {
      size: {
        value: 'large',
        options: ['large', 'normal', 'small'],
      },
      icon: {
        value: LucideIcon.Settings,
        options: LucideIcon,
      },
      active: false,
      glass: false,
      tooltip: folder({
        title: '',
        arrow: false,
        placement: {
          value: 'top',
          options: [
            'top',
            'left',
            'right',
            'bottom',
            'topLeft',
            'topRight',
            'bottomLeft',
            'bottomRight',
            'leftTop',
            'leftBottom',
            'rightTop',
            'rightBottom',
          ],
        },
        spotlight: false,
        loading: false,
      }),
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <ActionIcon {...control} />
    </StroyBook>
  );
};
