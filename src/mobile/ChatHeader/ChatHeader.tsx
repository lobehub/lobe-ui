'use client';

import * as stylex from '@stylexjs/stylex';
import { ChevronLeft } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import MobileSafeArea from '@/mobile/SafeArea';
import { styleProps } from '@/styles/stylex/props';

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
        flex={'none'}
        ref={ref}
        width={'100vw'}
        {...styleProps(styles.container, className, style)}
        {...rest}
      >
        {safeArea && <MobileSafeArea position={'top'} />}
        <Flexbox
          horizontal
          align={'center'}
          flex={1}
          height={44}
          justify={'space-between'}
          paddingInline={6}
          {...stylex.props(styles.inner)}
        >
          <Flexbox
            horizontal
            align={'center'}
            className={classNames?.left}
            flex={1}
            gap={gaps?.left}
            height={'100%'}
            style={custmStyles?.left}
          >
            {showBackButton && <ActionIcon icon={ChevronLeft} onClick={() => onBackClick?.()} />}
            {left}
          </Flexbox>
          <Flexbox
            horizontal
            align={'center'}
            className={classNames?.center}
            flex={1}
            gap={gaps?.center}
            height={'100%'}
            justify={'center'}
            style={custmStyles?.center}
          >
            {children}
            {center}
          </Flexbox>
          <Flexbox
            horizontal
            align={'center'}
            className={classNames?.right}
            flex={1}
            gap={gaps?.right}
            height={'100%'}
            justify={'flex-end'}
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
