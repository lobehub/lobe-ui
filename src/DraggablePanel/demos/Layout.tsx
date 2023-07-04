import {
  DraggablePanel,
  DraggablePanelBody,
  DraggablePanelContainer,
  DraggablePanelFooter,
  DraggablePanelHeader,
} from '@lobehub/ui';
import { useState } from 'react';
import styled from 'styled-components';

const View = styled.div`
  position: relative;

  display: flex;

  width: 100%;
  height: 100%;
  min-height: 500px;
`;

const Container = styled.div`
  padding: 24px;
`;

export default () => {
  const [expand, setExpand] = useState(true);
  const [pin, setPin] = useState(true);
  return (
    <View>
      <DraggablePanel
        expand={expand}
        mode={pin ? 'fixed' : 'float'}
        onExpandChange={setExpand}
        pin={pin}
        placement="left"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DraggablePanelContainer style={{ flex: 1 }}>
          <DraggablePanelHeader
            pin={pin}
            position="left"
            setExpand={setExpand}
            setPin={setPin}
            title="Header"
          />
          <DraggablePanelBody>DraggablePanel</DraggablePanelBody>
          <DraggablePanelFooter>Footer</DraggablePanelFooter>
        </DraggablePanelContainer>
      </DraggablePanel>
      <Container style={{ flex: 1 }}>Content</Container>
    </View>
  );
};
