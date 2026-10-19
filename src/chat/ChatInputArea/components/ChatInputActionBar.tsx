'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useResponsive } from '@/styles/theme/scope';

import { chatChatInputActionBarClasses } from '../stable';
import { actionBarStyles as styles } from '../style';
import type { ChatInputActionBarProps } from '../type';

const ChatInputActionBar: FC<ChatInputActionBarProps> = ({
  ref,
  padding = '0 16px',
  leftAddons,
  rightAddons,
  className,
  ...rest
}) => {
  const { mobile } = useResponsive();
  return (
    <Flexbox
      horizontal
      align={'center'}
      {...styleProps(styles.root, clsx(chatChatInputActionBarClasses(), className))}
      flex={'none'}
      justify={'space-between'}
      padding={padding}
      ref={ref}
      {...rest}
    >
      <Flexbox
        horizontal
        align={'center'}
        {...styleProps(styles.left, chatChatInputActionBarClasses('left'))}
        flex={1}
        gap={mobile ? 0 : 4}
      >
        {leftAddons}
      </Flexbox>
      <Flexbox
        horizontal
        align={'center'}
        className={chatChatInputActionBarClasses('right')}
        flex={0}
        gap={mobile ? 0 : 4}
        justify={'flex-end'}
      >
        {rightAddons}
      </Flexbox>
    </Flexbox>
  );
};

ChatInputActionBar.displayName = 'ChatInputActionBar';

export default ChatInputActionBar;
