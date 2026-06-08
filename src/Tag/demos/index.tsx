import { Icon, Tag, type TagProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Loader2Icon } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const { children, ...control } = useControls(
    {
      children: 'processing',
      closable: false,
      color: {
        options: [
          'success',
          'warning',
          'error',
          'info',
          'magenta',
          'red',
          'volcano',
          'orange',
          'gold',
          'lime',
          'green',
          'cyan',
          'blue',
          'geekblue',
          'purple',
          'gray',
        ],
        value: 'info',
      },
      shape: {
        options: ['normal', 'round'],
        value: 'normal',
      },
      size: {
        options: ['small', 'middle', 'large'],
        value: 'middle',
      },
      variant: {
        options: ['filled', 'outlined', 'borderless', 'solid'],
        value: 'filled',
      },
    },
    { store },
  ) as TagProps;

  return (
    <StoryBook levaStore={store}>
      <Tag icon={<Icon spin icon={Loader2Icon} />} {...control}>
        {children}
      </Tag>
    </StoryBook>
  );
};
