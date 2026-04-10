import { Button, Flexbox, Popover, type PopoverProps, Tag } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Sliders } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      arrow: true,
      content: 'This is the popover content',
      disabled: false,
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
      <Flexbox align="center" gap={16}>
        <Flexbox horizontal align="center" gap={12}>
          <Sliders size={20} style={{ color: 'var(--lobe-color-primary)' }} />
          <div style={{ fontSize: 15, fontWeight: 600 }}>Interactive Playground</div>
          <Tag color="blue">Customizable</Tag>
        </Flexbox>
        <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13 }}>
          Use the controls panel on the right to customize the popover properties
        </div>
        <Popover {...control}>
          <Button icon={<Sliders size={16} />} size="large" type="primary">
            {control.trigger === 'hover' ? 'Hover me' : 'Click me'}
          </Button>
        </Popover>
      </Flexbox>
    </StoryBook>
  );
};
