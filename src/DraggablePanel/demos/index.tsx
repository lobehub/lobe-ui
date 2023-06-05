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
      pin: true,
      mode: {
        value: 'fixed',
        options: ['fixed', 'float'],
      },
      placement: {
        value: 'left',
        options: ['left', 'right', 'top', 'bottom'],
      },
      minWidth: {
        value: 0,
        step: 1,
      },
      minHeight: {
        value: 0,
        step: 1,
      },
      expandable: true,
      defaultExpand: true,
      showHandlerWhenUnexpand: false,
      destroyOnClose: false,
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
              <Container>DraggablePanel</Container>
            </DraggablePanel>
            <Container style={{ flex: 1 }}>Content</Container>
          </>
        ) : (
          <>
            <Container style={{ flex: 1 }}>Content</Container>
            <DraggablePanel {...control}>
              <Container>DraggablePanel</Container>
            </DraggablePanel>
          </>
        )}
      </View>
    </StroyBook>
  );
};
