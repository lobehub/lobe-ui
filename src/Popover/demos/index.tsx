import { Button, Popover, type PopoverProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      arrow: true,
      content: 'This is the popover content',
      disabled: false,
      inset: false,
      placement: {
        options: [
          'top',
          'topLeft',
          'topRight',
          'bottom',
          'bottomLeft',
          'bottomRight',
          'left',
          'leftTop',
          'leftBottom',
          'right',
          'rightTop',
          'rightBottom',
        ],
        value: 'top',
      },
      trigger: {
        options: ['hover', 'click'],
        value: 'hover',
      },
    },
    { store },
  ) as PopoverProps;

  return (
    <StoryBook levaStore={store}>
      <Popover {...control}>
        <Button type="primary">Hover me</Button>
      </Popover>
    </StoryBook>
  );
};
