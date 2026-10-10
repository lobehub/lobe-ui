'use client';

import * as stylex from '@stylexjs/stylex';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { useResponsive } from '@/styles/theme/scope';

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
      {...stylex.props(styles.root)}
      flex={'none'}
      justify={'space-between'}
      padding={padding}
      ref={ref}
      {...rest}
    >
      <Flexbox
        horizontal
        align={'center'}
        {...stylex.props(styles.left)}
        flex={1}
        gap={mobile ? 0 : 4}
      >
        {leftAddons}
      </Flexbox>
      <Flexbox horizontal align={'center'} flex={0} gap={mobile ? 0 : 4} justify={'flex-end'}>
        {rightAddons}
      </Flexbox>
    </Flexbox>
  );
};

ChatInputActionBar.displayName = 'ChatInputActionBar';

export default ChatInputActionBar;
