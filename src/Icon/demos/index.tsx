import { Icon, IconProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import * as LucideIcon from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control: IconProps | any = useControls(
    {
      icon: {
        options: LucideIcon,
        value: LucideIcon.Settings,
      },
      size: {
        options: ['large', 'middle', 'small'],
        value: 'middle',
      },
      spin: false,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Icon {...control} />
    </StoryBook>
  );
};
