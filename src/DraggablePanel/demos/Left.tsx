import { DraggablePanel } from '@lobehub/ui';
import styled from 'styled-components';

const View = styled.div`
  position: relative;

  display: flex;

  width: 100%;
  height: 100%;
  min-height: 240px;
`;

export default () => {
  return (
    <View>
      <DraggablePanel placement="left">DraggablePanel</DraggablePanel>
      <div style={{ flex: 1 }}>Content</div>
    </View>
  );
};
