'use client';

import { ChevronLeft } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';

import { useStyles } from './style';
import type { ChatHeaderProps } from './type';

const ChatHeader = memo<ChatHeaderProps>(
  ({
    left,
    right,
    className,
    styles: contentStyles,
    gaps,
    classNames,
    showBackButton,
    onBackClick,
    children,
    gap = 16,
    ...rest
  }) => {
    const { cx, styles } = useStyles();

    return (
      <Flexbox
        align={'center'}
        className={cx(styles.container, className)}
        distribution={'space-between'}
        gap={gap}
        horizontal
        paddingInline={16}
        {...rest}
      >
        <Flexbox
          align={'center'}
          className={cx(styles.left, classNames?.left)}
          gap={gaps?.left || 12}
          horizontal
          justify={'flex-start'}
          style={contentStyles?.left}
        >
          {showBackButton && (
            <ActionIcon
              icon={ChevronLeft}
              onClick={() => onBackClick?.()}
              style={{ marginRight: gaps?.left ? -gaps.left / 2 : -6 }}
            />
          )}
          {left}
        </Flexbox>
        {children && (
          <Flexbox
            align={'center'}
            className={cx(styles.center, classNames?.center)}
            gap={gaps?.center || 8}
            horizontal
            justify={'center'}
            style={contentStyles?.center}
          >
            {children}
          </Flexbox>
        )}
        <Flexbox
          align={'center'}
          className={cx(styles.right, classNames?.right)}
          gap={gaps?.right || 8}
          horizontal
          justify={'flex-end'}
          style={contentStyles?.right}
        >
          {right}
        </Flexbox>
      </Flexbox>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
