'use client';

import { ChevronLeft } from 'lucide-react';
import { CSSProperties, ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface ChatHeaderProps extends DivProps {
  classNames?: {
    center?: string;
    left?: string;
    right?: string;
  };
  gap?: {
    center?: number;
    left?: number;
    right?: number;
  };
  left?: ReactNode;
  onBackClick?: () => void;
  right?: ReactNode;
  showBackButton?: boolean;
  styles?: {
    center?: CSSProperties;
    left?: CSSProperties;
    right?: CSSProperties;
  };
}
const ChatHeader = memo<ChatHeaderProps>(
  ({
    left,
    right,
    className,
    style,
    styles: contentStyles,
    classNames,
    showBackButton,
    onBackClick,
    gap,
    children,
  }) => {
    const { cx, styles } = useStyles();

    return (
      <Flexbox
        align={'center'}
        className={cx(styles.container, className)}
        distribution={'space-between'}
        horizontal
        paddingInline={16}
        style={style}
      >
        <Flexbox
          align={'center'}
          className={cx(styles.left, classNames?.left)}
          gap={gap?.left || 12}
          horizontal
          style={contentStyles?.left}
        >
          {showBackButton && (
            <ActionIcon
              icon={ChevronLeft}
              onClick={() => onBackClick?.()}
              size={{ fontSize: 24 }}
              style={{ marginRight: gap?.left ? -gap.left / 2 : -6 }}
            />
          )}
          {left}
        </Flexbox>
        {children && (
          <Flexbox
            align={'center'}
            className={cx(styles.center, classNames?.center)}
            gap={gap?.center || 12}
            horizontal
            style={contentStyles?.center}
          >
            {children}
          </Flexbox>
        )}
        <Flexbox
          align={'center'}
          className={cx(styles.right, classNames?.right)}
          gap={gap?.right || 8}
          horizontal
          style={contentStyles?.right}
        >
          {right}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default ChatHeader;
