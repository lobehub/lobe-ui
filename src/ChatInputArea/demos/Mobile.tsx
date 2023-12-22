import {
  ActionIcon,
  ChatInputActionBar,
  MobileChatInputArea,
  MobileChatSendButton,
  TokenTag,
} from '@lobehub/ui';
import { Eraser, Languages } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox style={{ height: 400, position: 'relative' }}>
      <div style={{ flex: 1 }}></div>
      <MobileChatInputArea
        textAreaRightAddons={<MobileChatSendButton />}
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
