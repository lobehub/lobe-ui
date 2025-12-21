import { DraggablePanel, DraggablePanelProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { Flexbox } from '@/Flex';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      defaultExpand: true,
      destroyOnClose: false,
      expandable: true,
      minHeight: {
        step: 1,
        value: 0,
      },
      minWidth: {
        step: 1,
        value: 100,
      },
      mode: {
        options: ['fixed', 'float'],
        value: 'fixed',
      },
      pin: true,
      placement: {
        options: ['left', 'right', 'top', 'bottom'],
        value: 'left',
      },
      showBorder: true,
      showHandleHighlight: false,
      showHandleWhenCollapsed: false,
    },
    { store },
  ) as DraggablePanelProps;

  return (
    <StoryBook levaStore={store} noPadding>
      <Flexbox
        height={'100%'}
        horizontal={['left', 'right'].includes(control.placement)}
        width={'100%'}
      >
        {['top', 'left'].includes(control.placement) ? (
          <>
            <DraggablePanel {...control}>
              <Flexbox padding={24}>Draggable Panel</Flexbox>
            </DraggablePanel>
            <Flexbox padding={24} style={{ flex: 1 }}>
              Content
            </Flexbox>
          </>
        ) : (
          <>
            <Flexbox padding={24} style={{ flex: 1 }}>
              Content
            </Flexbox>
            <DraggablePanel {...control}>
              <Flexbox padding={24}>Draggable Panel</Flexbox>
            </DraggablePanel>
          </>
        )}
      </Flexbox>
    </StoryBook>
  );
};
