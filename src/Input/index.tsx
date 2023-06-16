import { Input as AntInput, InputProps as AntdInputProps } from 'antd';
import { TextAreaProps as AntdTextAreaProps } from 'antd/es/input/TextArea';
import { forwardRef, memo } from 'react';

import { useStyles } from './style';

export interface InputProps extends AntdInputProps {
  ref?: any;
  type?: 'ghost' | 'block' | 'pure';
}

export const Input = memo<InputProps>(
  forwardRef(({ className, type = 'ghost', ...props }, ref) => {
    const { styles, cx } = useStyles({ type });

    return (
      <AntInput
        bordered={type !== 'pure'}
        className={cx(styles.input, className)}
        ref={ref}
        {...props}
      />
    );
  }),
);

export interface TextAreaProps extends AntdTextAreaProps {
  ref?: any;
  resize?: boolean;
  type?: 'ghost' | 'block' | 'pure';
}

export const TextArea = memo<TextAreaProps>(
  forwardRef(({ className, type = 'ghost', resize = true, style, ...props }, ref) => {
    const { styles, cx } = useStyles({ type });

    return (
      <AntInput.TextArea
        bordered={type !== 'pure'}
        className={cx(styles.textarea, className)}
        ref={ref}
        style={resize ? style : { resize: 'none', ...style }}
        {...props}
      />
    );
  }),
);
