import { useTheme } from 'antd-style';
import { Loader2, SendHorizontal } from 'lucide-react';
import { readableColor } from 'polished';
import { memo } from 'react';

import ActionIcon, { ActionIconProps, type ActionIconSize } from '@/ActionIcon';

export interface MobileChatSendButtonProps extends Omit<ActionIconProps,'loading'> {
  loading?: boolean;
  onSend?: () => void;
  onStop?: () => void;
}

const MobileChatSendButton = memo<MobileChatSendButtonProps>(({ loading, onStop, onSend,...rest }) => {
  const theme = useTheme();
  const size: ActionIconSize = {
    blockSize: 36,
    fontSize: 16,
  };

  return loading ? (
    <ActionIcon active icon={Loader2} onClick={onStop} size={size} spin {...rest}/>
  ) : (
    <ActionIcon
      icon={SendHorizontal}
      onClick={onSend}
      size={size}
      style={{
        background: theme.colorPrimary,
        color: readableColor(theme.colorPrimary),
        flex: 'none',
      }}
      {...rest}
    />
  );
});

export default MobileChatSendButton;
