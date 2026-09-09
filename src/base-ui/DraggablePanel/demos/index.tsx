import { DraggablePanel, type DraggablePanelProps } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { Flexbox } from '@/Flex';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      defaultExpand: true,
      expandable: true,
      minHeight: { step: 1, value: 0 },
      minWidth: { step: 1, value: 100 },
      mode: { options: ['fixed', 'float'], value: 'fixed' },
      placement: { options: ['left', 'right', 'top', 'bottom'], value: 'left' },
      showBorder: true,
      showHandleWhenCollapsed: false,
    },
    { store },
  ) as DraggablePanelProps;

  const placement = control.placement ?? 'left';
  const panel = (
    <DraggablePanel {...control}>
      <Flexbox padding={24}>Draggable Panel</Flexbox>
    </DraggablePanel>
  );
  const content = (
    <Flexbox padding={24} style={{ flex: 1 }}>
      Content
    </Flexbox>
  );

  return (
    <StoryBook noPadding levaStore={store}>
      <Flexbox height={'100%'} horizontal={!['top', 'bottom'].includes(placement)} width={'100%'}>
        {['top', 'left'].includes(placement) ? (
          <>
            {panel}
            {content}
          </>
        ) : (
          <>
            {content}
            {panel}
          </>
        )}
      </Flexbox>
    </StoryBook>
  );
};
