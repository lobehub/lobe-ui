import { cssVar } from 'antd-style';
import { ArrowBigUp, CornerDownLeft, Loader2 } from 'lucide-react';
import { type FC } from 'react';

import Button from '@/Button';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import type { ChatSendButtonProps } from '../type';

const ChatSendButton: FC<ChatSendButtonProps> = ({
  ref,
  leftAddons,
  rightAddons,
  texts,
  onSend,
  loading,
  onStop,
  ...rest
}) => {
  return (
    <Flexbox
      horizontal
      align={'end'}
      distribution={'space-between'}
      flex={'none'}
      gap={8}
      paddingInline={16}
      ref={ref}
      {...rest}
    >
      <Flexbox horizontal align={'center'} gap={8}>
        {leftAddons}
      </Flexbox>
      <Flexbox horizontal align={'center'} gap={8}>
        <Flexbox
          horizontal
          gap={4}
          style={{ color: cssVar.colorTextDescription, fontSize: 12, marginRight: 12 }}
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
          <Button type={'primary'} onClick={onSend}>
            {texts?.send || 'Send'}
          </Button>
        )}
      </Flexbox>
    </Flexbox>
  );
};

ChatSendButton.displayName = 'ChatSendButton';

export default ChatSendButton;
