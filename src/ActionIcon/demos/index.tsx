import { ActionIcon, ActionIconProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
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
      variant: {
        options: ['default', 'block', 'ghost'],
        value: 'default',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <ActionIcon {...control} />
    </StoryBook>
  );
};
