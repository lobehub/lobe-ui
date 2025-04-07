import { ActionIcon, ActionIconProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import * as LucideIcon from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control: ActionIconProps | any = useControls(
    {
      active: false,
      danger: false,
      disabled: false,
      glass: false,
      icon: {
        options: LucideIcon,
        value: LucideIcon.Settings,
      },
      loading: false,
      shadow: false,
      size: {
        options: ['large', 'middle', 'small'],
        value: 'middle',
      },
      title: 'Settings',
      variant: {
        options: ['borderless', 'filled', 'outlined'],
        value: 'borderless',
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
