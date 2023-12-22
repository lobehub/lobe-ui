import {
  DraggablePanel,
  DraggablePanelBody,
  DraggablePanelContainer,
  DraggablePanelFooter,
  DraggablePanelHeader,
} from '@lobehub/ui';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const [expand, setExpand] = useState(true);
  const [pin, setPin] = useState(true);
  return (
    <Flexbox style={{ height: '100%', minHeight: 500, position: 'relative', width: '100%' }}>
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
      <div style={{ flex: 1, padding: 24 }}>Content</div>
    </Flexbox>
  );
};
