import { Icon, Tag, type TagProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Loader2Icon } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const { children, ...control }: TagProps | any = useControls(
    {
      children: 'processing',
      closable: false,
      size: {
        options: ['small', 'middle', 'large'],
        value: 'middle',
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Tag icon={<Icon icon={Loader2Icon} spin />} {...control}>
        {children}
      </Tag>
    </StoryBook>
  );
};
