import { ActionIcon, ActionIconProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { folder } from 'leva';
import * as LucideIcon from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control: ActionIconProps | any = useControls(
    {
      active: false,
      glass: false,
      icon: {
        options: LucideIcon,
        value: LucideIcon.Settings,
      },
      size: {
        options: ['large', 'normal', 'small'],
        value: 'large',
      },
      tooltip: folder({
        arrow: false,
        loading: false,
        placement: {
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
          value: 'top',
        },
        spotlight: false,
        title: '',
      }),
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <ActionIcon {...control} />
    </StoryBook>
  );
};
