'use client';

import { ChevronLeft } from 'lucide-react';
import { CSSProperties, ReactNode, memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';

import { useStyles } from './style';

export interface ChatHeaderProps extends FlexboxProps {
  classNames?: {
    center?: string;
    left?: string;
    right?: string;
  };
  gaps?: {
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
              size={{ fontSize: 24 }}
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

export default ChatHeader;
