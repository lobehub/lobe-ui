import { DraggablePanel, DraggablePanelProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const store = useCreateStore();
  const control: DraggablePanelProps | any = useControls(
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
        value: 0,
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
      showHandlerWhenUnexpand: false,
    },
    { store },
  );

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
