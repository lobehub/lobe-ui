import { Button, ButtonProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import * as LucideIcon from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      danger: false,
      disabled: false,
      glass: false,
      icon: {
        options: LucideIcon,
        value: LucideIcon.CameraIcon,
      },
      iconPlacement: {
        options: ['start', 'end'],
        value: 'start',
      },
      loading: false,
      shadow: false,
      size: {
        options: ['large', 'default', 'small'],
        value: 'default',
      },
      type: {
        options: ['primary', 'default', 'text', 'link'],
        value: 'primary',
      },
      variant: {
        options: [undefined, 'normal', 'filled', 'solid', 'outlined', 'dashed', 'text', 'link'],
        value: undefined,
      },
    },
    { store },
  ) as ButtonProps;

  return (
    <StoryBook levaStore={store}>
      <Button {...control}>Button</Button>
    </StoryBook>
  );
};
