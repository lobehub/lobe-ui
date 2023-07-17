import { Input as AntInput, type InputProps as AntdInputProps, type InputRef } from 'antd';
import { TextAreaProps as AntdTextAreaProps, TextAreaRef } from 'antd/es/input/TextArea';
import { type Ref, forwardRef } from 'react';

import { useStyles } from './style';

export interface InputProps extends AntdInputProps {
  /**
   * @description Ref of the component
   */
  ref?: Ref<InputRef>;
  /**
   * @description Type of the input
   * @default 'ghost'
   */
  type?: 'ghost' | 'block' | 'pure';
}

export const Input = forwardRef<InputRef, InputProps>(
  ({ className, type = 'ghost', ...props }, reference) => {
    const { styles, cx } = useStyles({ type });

    return (
      <AntInput
        bordered={type !== 'pure'}
        className={cx(styles.input, className)}
        ref={reference}
        {...props}
      />
    );
  },
);

export interface TextAreaProps extends AntdTextAreaProps {
  /**
   * @description Ref of the component
   * @default undefined
   */
  ref?: Ref<InputRef>;
  /**
   * @description Whether to enable resizing of the textarea
   * @default true
   */
  resize?: boolean;
  /**
   * @description Type of the textarea
   * @default 'ghost'
   */
  type?: 'ghost' | 'block' | 'pure';
}

export const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  ({ className, type = 'ghost', resize = true, style, ...props }, reference) => {
    const { styles, cx } = useStyles({ type });

    return (
      <AntInput.TextArea
        bordered={type !== 'pure'}
        className={cx(styles.textarea, className)}
        ref={reference}
        style={resize ? style : { resize: 'none', ...style }}
        {...props}
      />
    );
  },
);
