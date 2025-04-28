'use client';

import { Input as AntInput } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useStyles } from './style';
import type { TextAreaProps } from './type';

const TextArea = memo<TextAreaProps>(
  ({ ref, variant, shadow, className, resize = false, style, ...rest }) => {
    const { styles, cx, theme } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
              underlined: null,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <AntInput.TextArea
        className={cx(
          variants({ shadow, variant: variant || (theme.isDarkMode ? 'filled' : 'outlined') }),
          className,
        )}
        ref={ref}
        style={{
          resize: resize ? undefined : 'none',
          ...style,
        }}
        variant={variant || (theme.isDarkMode ? 'filled' : 'outlined')}
        {...rest}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
