import { DraggablePanel } from 'lobe-ui';
import styled from 'styled-components';

const View = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  min-height: 240px;
`;

export default () => {
  return (
    <View>
      <div style={{ flex: 1 }}>Content</div>
      <DraggablePanel placement="bottom">DraggablePanel</DraggablePanel>
    </View>
  );
};
