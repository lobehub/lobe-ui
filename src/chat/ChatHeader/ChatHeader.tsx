'use client';

import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { chatChatHeaderClasses } from './stable';
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
        className={styleProps(styles.container, clsx(chatChatHeaderClasses(), className)).className}
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
          flex={1}
          gap={gaps?.left || 12}
          justify={'flex-start'}
          paddingInline={'8px 0'}
          style={contentStyles?.left}
          className={
            styleProps(styles.left, clsx(chatChatHeaderClasses('left'), classNames?.left)).className
          }
        >
          {showBackButton && (
            <ActionIcon
              className={chatChatHeaderClasses('back')}
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
            gap={gaps?.center || 8}
            justify={'center'}
            style={contentStyles?.center}
            className={
              styleProps(styles.center, clsx(chatChatHeaderClasses('center'), classNames?.center))
                .className
            }
          >
            {children}
          </Flexbox>
        )}
        <Flexbox
          horizontal
          align={'center'}
          flex={'none'}
          gap={gaps?.right || 8}
          justify={'flex-end'}
          style={contentStyles?.right}
          className={
            styleProps(styles.right, clsx(chatChatHeaderClasses('right'), classNames?.right))
              .className
          }
        >
          {right}
        </Flexbox>
      </Flexbox>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
