'use client';

import { Separator } from '@base-ui/react/separator';
import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { DividerProps } from './type';

const Divider = memo<DividerProps>(
  ({ children, className, dashed = false, orientation = 'horizontal', ref, style, ...rest }) => {
    if (children != null && orientation === 'horizontal') {
      return (
        <Separator
          orientation="horizontal"
          ref={ref}
          {...styleProps([styles.withText, dashed && styles.dashed], className, style)}
          {...rest}
        >
          <span {...stylex.props(styles.text)}>{children}</span>
        </Separator>
      );
    }

    return (
      <Separator
        orientation={orientation}
        ref={ref}
        {...styleProps(
          [
            orientation === 'vertical' ? styles.vertical : styles.horizontal,
            dashed && styles.dashed,
          ],
          className,
          style,
        )}
        {...rest}
      />
    );
  },
);

Divider.displayName = 'Divider';

export default Divider;
