import type {
  InputNumberProps as AntdInputNumberProps,
  InputProps as AntdInputProps,
  InputRef,
} from 'antd';
import type { OTPProps as AntdOPTProps, OTPRef } from 'antd/es/input/OTP';
import type { PasswordProps as AntdPasswordProps } from 'antd/es/input/Password';
import type { TextAreaProps as AntdTextAreaProps, TextAreaRef } from 'antd/es/input/TextArea';
import type { Ref } from 'react';

export interface InputProps extends AntdInputProps {
  ref?: Ref<InputRef>;
  shadow?: boolean;
}

export interface TextAreaProps extends AntdTextAreaProps {
  ref?: Ref<TextAreaRef>;
  resize?: boolean;
  shadow?: boolean;
}

export interface InputNumberProps extends AntdInputNumberProps {
  ref?: Ref<HTMLInputElement>;
  shadow?: boolean;
}

export interface InputPasswordProps extends AntdPasswordProps {
  ref?: Ref<InputRef>;
  shadow?: boolean;
}

export interface InputOPTProps extends AntdOPTProps {
  ref?: Ref<OTPRef>;
  shadow?: boolean;
}
