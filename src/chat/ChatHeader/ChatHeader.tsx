'use client';

import { cx } from 'antd-style';
import { ChevronLeft } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';

import { styles } from './style';
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
    return (
      <Flexbox
        horizontal
        align={'center'}
        className={cx(styles.container, className)}
        distribution={'space-between'}
        gap={gap}
        paddingInline={16}
        {...rest}
      >
        <Flexbox
          horizontal
          align={'center'}
          className={cx(styles.left, classNames?.left)}
          gap={gaps?.left || 12}
          justify={'flex-start'}
          style={contentStyles?.left}
        >
          {showBackButton && (
            <ActionIcon
              icon={ChevronLeft}
              style={{ marginRight: gaps?.left ? -gaps.left / 2 : -6 }}
              onClick={() => onBackClick?.()}
            />
          )}
          {left}
        </Flexbox>
        {children && (
          <Flexbox
            horizontal
            align={'center'}
            className={cx(styles.center, classNames?.center)}
            gap={gaps?.center || 8}
            justify={'center'}
            style={contentStyles?.center}
          >
            {children}
          </Flexbox>
        )}
        <Flexbox
          horizontal
          align={'center'}
          className={cx(styles.right, classNames?.right)}
          gap={gaps?.right || 8}
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
