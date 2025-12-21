'use client';

import { ChevronLeft } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import MobileSafeArea from '@/mobile/SafeArea';

import { useStyles } from './style';
import { ChatHeaderProps } from './type';

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
    const { styles, cx } = useStyles();

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
          align={'center'}
          className={styles.inner}
          flex={1}
          horizontal
          justify={'space-between'}
        >
          <Flexbox
            align={'center'}
            className={cx(styles.left, classNames?.left)}
            flex={1}
            gap={gaps?.left}
            horizontal
            style={custmStyles?.left}
          >
            {showBackButton && <ActionIcon icon={ChevronLeft} onClick={() => onBackClick?.()} />}
            {left}
          </Flexbox>
          <Flexbox
            align={'center'}
            className={cx(styles.center, classNames?.center)}
            flex={1}
            gap={gaps?.center}
            horizontal
            justify={'center'}
            style={custmStyles?.center}
          >
            {children}
            {center}
          </Flexbox>
          <Flexbox
            align={'center'}
            className={cx(styles.right, classNames?.right)}
            flex={1}
            gap={gaps?.right}
            horizontal
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
