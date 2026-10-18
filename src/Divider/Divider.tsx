'use client';

import { Separator } from '@base-ui/react/separator';
import clsx from 'clsx';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { dividerClasses } from './stable';
import { styles } from './style';
import type { DividerProps } from './type';

const Divider = memo<DividerProps>(
  ({ children, className, dashed = false, orientation = 'horizontal', ref, style, ...rest }) => {
    if (children != null && orientation === 'horizontal') {
      return (
        <Separator
          orientation="horizontal"
          ref={ref}
          {...toDataAttributes({ dashed })}
          {...styleProps(
            [styles.withText, dashed && styles.dashed],
            clsx(dividerClasses(), className),
            style,
          )}
          {...rest}
        >
          <span {...styleProps(styles.text, dividerClasses('text'))}>{children}</span>
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
          clsx(dividerClasses(), className),
          style,
        )}
        {...toDataAttributes({ dashed })}
        {...rest}
      />
    );
  },
);

Divider.displayName = 'Divider';

export default Divider;
