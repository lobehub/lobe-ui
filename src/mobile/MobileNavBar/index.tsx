'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CSSProperties, ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import { useDirection } from '@/hooks/useDirection';
import MobileSafeArea from '@/mobile/MobileSafeArea';

import { useStyles } from './style';

export interface MobileNavBarProps {
  center?: ReactNode;
  className?: string;
  classNames?: {
    center?: string;
    left?: string;
    right?: string;
  };
  contentStyles?: {
    center?: CSSProperties;
    left?: CSSProperties;
    right?: CSSProperties;
  };
  gap?: {
    center?: number;
    left?: number;
    right?: number;
  };
  left?: ReactNode;
  onBackClick?: () => void;
  right?: ReactNode;
  safeArea?: boolean;
  showBackButton?: boolean;
  style?: CSSProperties;
}

const MobileNavBar = memo<MobileNavBarProps>(
  ({
    className,
    safeArea = true,
    style,
    center,
    left,
    right,
    gap,
    classNames,
    onBackClick,
    showBackButton,
    contentStyles,
  }) => {
    const { styles, cx } = useStyles();
    const direction = useDirection();

    return (
      <Flexbox className={cx(styles.container, className)} style={style}>
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
            gap={gap?.left}
            horizontal
            style={contentStyles?.left}
          >
            {showBackButton && (
              <ActionIcon
                icon={direction === 'rtl' ? ChevronRight : ChevronLeft}
                onClick={() => onBackClick?.()}
                size={{ fontSize: 24 }}
              />
            )}
            {left}
          </Flexbox>
          <Flexbox
            align={'center'}
            className={cx(styles.center, classNames?.center)}
            flex={1}
            gap={gap?.center}
            horizontal
            justify={'center'}
            style={contentStyles?.center}
          >
            {center}
          </Flexbox>
          <Flexbox
            align={'center'}
            className={cx(styles.right, classNames?.right)}
            flex={1}
            gap={gap?.right}
            horizontal
            style={contentStyles?.right}
          >
            {right}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  },
);

export default MobileNavBar;
