'use client';

import { Separator } from '@base-ui/react/separator';
import { cx } from 'antd-style';
import { memo } from 'react';

import { styles } from './style';
import type { DividerProps } from './type';

const Divider = memo<DividerProps>(
  ({ children, className, dashed = false, orientation = 'horizontal', ref, ...rest }) => {
    if (children != null && orientation === 'horizontal') {
      return (
        <Separator
          className={cx(styles.withText, dashed && styles.dashed, className)}
          orientation="horizontal"
          ref={ref}
          {...rest}
        >
          <span className={styles.text}>{children}</span>
        </Separator>
      );
    }

    return (
      <Separator
        orientation={orientation}
        ref={ref}
        className={cx(
          orientation === 'vertical' ? styles.vertical : styles.horizontal,
          dashed && styles.dashed,
          className,
        )}
        {...rest}
      />
    );
  },
);

Divider.displayName = 'Divider';

export default Divider;
