import { cssVar } from 'antd-style';
import { ArrowBigUp, CornerDownLeft, Loader2 } from 'lucide-react';
import { type FC } from 'react';

import Button from '@/Button';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import { ChatSendButtonProps } from '../type';

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
      align={'end'}
      distribution={'space-between'}
      flex={'none'}
      gap={8}
      horizontal
      paddingInline={16}
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
          <Button onClick={onSend} type={'primary'}>
            {texts?.send || 'Send'}
          </Button>
        )}
      </Flexbox>
    </Flexbox>
  );
};

ChatSendButton.displayName = 'ChatSendButton';

export default ChatSendButton;
