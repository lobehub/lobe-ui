import { useTheme } from 'antd-style';
import { ArrowBigUp, CornerDownLeft, Loader2 } from 'lucide-react';
import { CSSProperties, ReactNode, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import Button from '@/Button';
import Icon from '@/Icon';

export interface ChatSendButtonProps extends FlexboxProps {
  className?: string;
  leftAddons?: ReactNode;
  loading?: boolean;
  onSend?: () => void;
  onStop?: () => void;
  rightAddons?: ReactNode;
  style?: CSSProperties;
  texts?: {
    send?: string;
    stop?: string;
    warp?: string;
  };
}

const ChatSendButton = forwardRef<HTMLDivElement, ChatSendButtonProps>(
  ({ leftAddons, rightAddons, texts, onSend, loading, onStop, ...rest }, ref) => {
    const theme = useTheme();

    return (
      <Flexbox
        align={'end'}
        distribution={'space-between'}
        flex={'none'}
        gap={8}
        horizontal
        padding={'0 24px'}
        ref={ref}
        {...rest}
      >
        <Flexbox align={'center'} gap={8} horizontal>
          {leftAddons}
        </Flexbox>
        <Flexbox align={'center'} gap={8} horizontal>
          <Flexbox
            gap={4}
            horizontal
            style={{ color: theme.colorTextDescription, fontSize: 12, marginRight: 12 }}
          >
            <Icon icon={CornerDownLeft} />
            <span>{texts?.send || 'Send'}</span>
            <span>/</span>
            <Flexbox horizontal>
              <Icon icon={ArrowBigUp} />
              <Icon icon={CornerDownLeft} />
            </Flexbox>
            <span>{texts?.warp || 'Warp'}</span>
          </Flexbox>
          {rightAddons}
          {loading ? (
            <Button icon={loading && Loader2} onClick={onStop}>
              {texts?.stop || 'Stop'}
            </Button>
          ) : (
            <Button onClick={onSend} type={'primary'}>
              {texts?.send || 'Send'}
            </Button>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

ChatSendButton.displayName = 'ChatSendButton';

export default ChatSendButton;
