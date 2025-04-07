'use client';

import { Input as AntInput } from 'antd';
import { TextAreaProps as AntdTextAreaProps, type TextAreaRef } from 'antd/es/input/TextArea';
import { cva } from 'class-variance-authority';
import { forwardRef, useMemo } from 'react';

import { useStyles } from './style';

export interface TextAreaProps extends AntdTextAreaProps {
  resize?: boolean;
  shadow?: boolean;
}

const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  ({ variant = 'filled', shadow, className, resize = false, style, ...rest }, ref) => {
    const { styles, cx } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
            variant: 'filled',
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
        className={cx(variants({ shadow, variant }), className)}
        ref={ref}
        style={{ resize: resize ? undefined : 'none', ...style }}
        variant={variant}
        {...rest}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
