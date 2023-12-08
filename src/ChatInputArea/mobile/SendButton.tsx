import { useTheme } from 'antd-style';
import { Loader2, SendHorizonal } from 'lucide-react';
import { readableColor } from 'polished';
import { memo } from 'react';

import ActionIcon, { type ActionIconSize } from '@/ActionIcon';

export interface MobileChatSendButtonProps {
  loading?: boolean;
  onSend?: () => void;
  onStop?: () => void;
}

const MobileChatSendButton = memo<MobileChatSendButtonProps>(({ loading, onStop, onSend }) => {
  const theme = useTheme();
  const size: ActionIconSize = {
    blockSize: 36,
    fontSize: 16,
  };

  return loading ? (
    <ActionIcon active icon={Loader2} onClick={onStop} size={size} spin />
  ) : (
    <ActionIcon
      icon={SendHorizonal}
      onClick={onSend}
      size={size}
      style={{
        background: theme.colorPrimary,
        color: readableColor(theme.colorPrimary),
        flex: 'none',
      }}
    />
  );
});

export default MobileChatSendButton;
