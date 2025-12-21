import { ActionIcon } from '@lobehub/ui';
import { ChatInputActionBar, ChatInputArea, ChatSendButton, TokenTag } from '@lobehub/ui/chat';
import { Eraser, Languages } from 'lucide-react';

import { Flexbox } from '@/Flex';

export default () => {
  return (
    <Flexbox style={{ height: 400, position: 'relative' }}>
      <div style={{ flex: 1 }} />
      <ChatInputArea
        bottomAddons={<ChatSendButton />}
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
