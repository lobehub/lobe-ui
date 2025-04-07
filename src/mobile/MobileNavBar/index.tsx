'use client';

import { ChevronLeft } from 'lucide-react';
import { CSSProperties, ReactNode, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import MobileSafeArea from '@/mobile/MobileSafeArea';

import { useStyles } from './style';

export interface MobileNavBarProps extends FlexboxProps {
  center?: ReactNode;
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
  safeArea?: boolean;
  showBackButton?: boolean;
  styles?: {
    center?: CSSProperties;
    left?: CSSProperties;
    right?: CSSProperties;
  };
}

const MobileNavBar = forwardRef<HTMLDivElement, MobileNavBarProps>(
  (
    {
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
    },
    ref,
  ) => {
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

MobileNavBar.displayName = 'MobileNavBar';

export default MobileNavBar;
