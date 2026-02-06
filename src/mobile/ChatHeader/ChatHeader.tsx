'use client';

import { cx } from 'antd-style';
import { ChevronLeft } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import MobileSafeArea from '@/mobile/SafeArea';

import { styles } from './style';
import type { ChatHeaderProps } from './type';

const ChatHeader = memo<ChatHeaderProps>(
  ({
    ref,
    className,
    safeArea = true,
    style,
    center,
    left,
    right,
    gaps,
    classNames,
    onBackClick,
    showBackButton,
    styles: custmStyles,
    children,
    ...rest
  }) => {
    return (
      <Flexbox
        as={'header'}
        className={cx(styles.container, className)}
        ref={ref}
        style={style}
        {...rest}
      >
        {safeArea && <MobileSafeArea position={'top'} />}
        <Flexbox
          horizontal
          align={'center'}
          className={styles.inner}
          flex={1}
          justify={'space-between'}
        >
          <Flexbox
            horizontal
            align={'center'}
            className={cx(styles.left, classNames?.left)}
            flex={1}
            gap={gaps?.left}
            style={custmStyles?.left}
          >
            {showBackButton && <ActionIcon icon={ChevronLeft} onClick={() => onBackClick?.()} />}
            {left}
          </Flexbox>
          <Flexbox
            horizontal
            align={'center'}
            className={cx(styles.center, classNames?.center)}
            flex={1}
            gap={gaps?.center}
            justify={'center'}
            style={custmStyles?.center}
          >
            {children}
            {center}
          </Flexbox>
          <Flexbox
            horizontal
            align={'center'}
            className={cx(styles.right, classNames?.right)}
            flex={1}
            gap={gaps?.right}
            style={custmStyles?.right}
          >
            {right}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
