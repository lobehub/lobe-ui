import { Input as AntInput, InputProps as AntdInputProps } from 'antd';
import { TextAreaProps as AntdTextAreaProps } from 'antd/es/input/TextArea';
import { memo } from 'react';
import { useStyles } from './style';
export interface InputProps extends AntdInputProps {
  ref?: any;
  type?: 'ghost' | 'block';
}

export const Input = memo<InputProps>(({ className, type = 'ghost', ...props }) => {
  const { styles, cx } = useStyles({ type });
  return <AntInput className={cx(styles.input, className)} {...props} />;
});

export interface TextAreaProps extends AntdTextAreaProps {
  ref?: any;
  type?: 'ghost' | 'block';
}

export const TextArea = memo<TextAreaProps>(({ className, type = 'ghost', ...props }) => {
  const { styles, cx } = useStyles({ type });
  return <AntInput.TextArea className={cx(styles.textarea, className)} {...props} />;
});
