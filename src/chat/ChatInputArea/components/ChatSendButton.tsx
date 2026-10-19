import clsx from 'clsx';
import { ArrowBigUp, CornerDownLeft, Loader2 } from 'lucide-react';
import { type FC } from 'react';

import Button from '@/Button';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import { chatChatSendButtonClasses } from '../stable';
import { sendButtonStyles as styles } from '../style';
import type { ChatSendButtonProps } from '../type';

const ChatSendButton: FC<ChatSendButtonProps> = ({
  ref,
  leftAddons,
  rightAddons,
  texts,
  onSend,
  loading,
  onStop,
  className,
  ...rest
}) => {
  return (
    <Flexbox
      horizontal
      align={'end'}
      className={clsx(chatChatSendButtonClasses(), className)}
      distribution={'space-between'}
      flex={'none'}
      gap={8}
      paddingInline={16}
      ref={ref}
      {...rest}
    >
      <Flexbox horizontal align={'center'} className={chatChatSendButtonClasses('left')} gap={8}>
        {leftAddons}
      </Flexbox>
      <Flexbox horizontal align={'center'} className={chatChatSendButtonClasses('right')} gap={8}>
        <Flexbox horizontal gap={4} {...styleProps(styles.hint, chatChatSendButtonClasses('hint'))}>
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
          <Button
            className={chatChatSendButtonClasses('stop')}
            icon={loading && Loader2}
            onClick={onStop}
          >
            {texts?.stop || 'Stop'}
          </Button>
        ) : (
          <Button className={chatChatSendButtonClasses('send')} type={'primary'} onClick={onSend}>
            {texts?.send || 'Send'}
          </Button>
        )}
      </Flexbox>
    </Flexbox>
  );
};

ChatSendButton.displayName = 'ChatSendButton';

export default ChatSendButton;
