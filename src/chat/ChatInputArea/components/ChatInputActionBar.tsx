'use client';

import { useResponsive } from 'antd-style';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';

import { actionBarStyles as styles } from '../style';
import type { ChatInputActionBarProps } from '../type';

const ChatInputActionBar: FC<ChatInputActionBarProps> = ({
  ref,
  padding = '0 16px',
  leftAddons,
  rightAddons,
  ...rest
}) => {
  const { mobile } = useResponsive();
  return (
    <Flexbox
      horizontal
      align={'center'}
      className={styles.root}
      flex={'none'}
      justify={'space-between'}
      padding={padding}
      ref={ref}
      {...rest}
    >
      <Flexbox horizontal align={'center'} className={styles.left} flex={1} gap={mobile ? 0 : 4}>
        {leftAddons}
      </Flexbox>
      <Flexbox
        horizontal
        align={'center'}
        className={styles.right}
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
