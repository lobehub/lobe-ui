'use client';

import { ChevronLeft } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

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
        className={styleProps(styles.container, className).className}
        distribution={'space-between'}
        gap={gap}
        height={52}
        paddingInline={16}
        width={'100%'}
        {...rest}
      >
        <Flexbox
          horizontal
          align={'center'}
          className={styleProps(styles.left, classNames?.left).className}
          flex={1}
          gap={gaps?.left || 12}
          justify={'flex-start'}
          paddingInline={'8px 0'}
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
            className={styleProps(styles.center, classNames?.center).className}
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
          className={styleProps(styles.right, classNames?.right).className}
          flex={'none'}
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
