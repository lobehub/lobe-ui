import { ActionIcon, ChatInputArea, DraggablePanel, Icon, TokenTag } from '@lobehub/ui';
import { Button } from 'antd';
import { Archive, Eraser, Languages } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';

const View = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 400px;
`;

export default () => {
  const [expand, setExpand] = useState<boolean>(false);
  return (
    <View>
      <div style={{ flex: 1 }}></div>
      <DraggablePanel expandable={false} fullscreen={expand} minHeight={200} placement="bottom">
        <ChatInputArea
          actions={
            <>
              <ActionIcon icon={Languages} />
              <ActionIcon icon={Eraser} />
              <TokenTag maxValue={5000} value={1000} />
            </>
          }
          expand={expand}
          footer={<Button icon={<Icon icon={Archive} />} />}
          minHeight={200}
          onExpandChange={setExpand}
        />
      </DraggablePanel>
    </View>
  );
};
