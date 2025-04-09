'use client';

import { useResponsive } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useActionBarStyles as useStyles } from '../style';
import { ChatInputActionBarProps } from '../type';

const ChatInputActionBar = memo<ChatInputActionBarProps>(
  ({ ref, padding = '0 16px', leftAddons, rightAddons, ...rest }) => {
    const { mobile } = useResponsive();
    const { styles } = useStyles();
    return (
      <Flexbox
        align={'center'}
        className={styles.root}
        flex={'none'}
        horizontal
        justify={'space-between'}
        padding={padding}
        ref={ref}
        {...rest}
      >
        <Flexbox align={'center'} className={styles.left} flex={1} gap={mobile ? 0 : 4} horizontal>
          {leftAddons}
        </Flexbox>
        <Flexbox
          align={'center'}
          className={styles.right}
          flex={0}
          gap={mobile ? 0 : 4}
          horizontal
          justify={'flex-end'}
        >
          {rightAddons}
        </Flexbox>
      </Flexbox>
    );
  },
);

ChatInputActionBar.displayName = 'ChatInputActionBar';

export default ChatInputActionBar;
