import { Button } from 'antd';
import { useTheme } from 'antd-style';
import { ArrowBigUp, CornerDownLeft, Loader2 } from 'lucide-react';
import { CSSProperties, ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';

export interface ChatSendButtonProps {
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

const ChatSendButton = memo<ChatSendButtonProps>(
  ({ className, style, leftAddons, rightAddons, texts, onSend, loading, onStop }) => {
    const theme = useTheme();

    return (
      <Flexbox
        align={'end'}
        className={className}
        distribution={'space-between'}
        flex={'none'}
        gap={8}
        horizontal
        padding={'0 24px'}
        style={style}
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
            <Button icon={loading && <Icon icon={Loader2} spin />} onClick={onStop}>
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

export default ChatSendButton;
