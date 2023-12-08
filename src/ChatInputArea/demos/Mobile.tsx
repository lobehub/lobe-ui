import {
  ActionIcon,
  ChatInputActionBar,
  MobileChatInputArea,
  MobileChatSendButton,
  TokenTag,
} from '@lobehub/ui';
import { Eraser, Languages } from 'lucide-react';
import styled from 'styled-components';

const View = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 400px;
`;

export default () => {
  return (
    <View>
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
    </View>
  );
};
