'use client';

import { createStyles, useResponsive } from 'antd-style';
import { ReactNode, forwardRef } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, cx, stylish }) => ({
  left: cx(
    stylish.noScrollbar,
    css`
      overflow: auto hidden;
    `,
  ),
  right: css``,
  root: css`
    position: relative;
    overflow: hidden;
    width: 100%;
  `,
}));

export interface ChatInputActionBarProps {
  leftAddons?: ReactNode;
  mobile?: boolean;
  padding?: number | string;
  rightAddons?: ReactNode;
}

const ChatInputActionBar = forwardRef<HTMLDivElement, ChatInputActionBarProps>(
  ({ padding = '0 16px', leftAddons, rightAddons, ...rest }, ref) => {
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

export default ChatInputActionBar;
