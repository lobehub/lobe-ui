import {
  DraggablePanel,
  DraggablePanelProps,
  StroyBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import styled from 'styled-components';

const View = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  padding: 24px;
`;

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
    <StroyBook levaStore={store} noPadding>
      <View
        style={['top', 'bottom'].includes(control.placement) ? { flexDirection: 'column' } : {}}
      >
        {['top', 'left'].includes(control.placement) ? (
          <>
            <DraggablePanel {...control}>
              <Container>Draggable Panel</Container>
            </DraggablePanel>
            <Container style={{ flex: 1 }}>Content</Container>
          </>
        ) : (
          <>
            <Container style={{ flex: 1 }}>Content</Container>
            <DraggablePanel {...control}>
              <Container>Draggable Panel</Container>
            </DraggablePanel>
          </>
        )}
      </View>
    </StroyBook>
  );
};
