import { ActionIcon } from '@lobehub/ui';
import { ChatInputActionBar, TokenTag } from '@lobehub/ui/chat';
import { ChatInputArea } from '@lobehub/ui/mobile';
import { Eraser, Languages } from 'lucide-react';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const [expand, setExpand] = useState(false);
  return (
    <Flexbox style={{ height: 400, position: 'relative' }}>
      <div style={{ flex: 1 }} />
      <ChatInputArea
        expand={expand}
        setExpand={setExpand}
        textAreaRightAddons={<ChatInputArea.SendButton />}
        topAddons={
          <ChatInputActionBar
            leftAddons={
              <>
                <ActionIcon icon={Languages} />
                <ActionIcon icon={Eraser} />
                <TokenTag maxValue={5000} value={1000} />
              </>
            }
          />
        }
      />
    </Flexbox>
  );
};
