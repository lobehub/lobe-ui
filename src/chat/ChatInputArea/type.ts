import type { TextAreaRef } from 'antd/es/input/TextArea';
import { CSSProperties, ReactNode, Ref } from 'react';
import { FlexboxProps } from 'react-layout-kit';

import type { DraggablePanelProps } from '@/DraggablePanel';
import type { TextAreaProps } from '@/Input';

export interface ChatInputAreaProps extends Omit<ChatInputAreaInnerProps, 'classNames'> {
  bottomAddons?: ReactNode;
  classNames?: DraggablePanelProps['classNames'];
  expand?: boolean;
  heights?: {
    headerHeight?: number;
    inputHeight?: number;
    maxHeight?: number;
    minHeight?: number;
  };
  onSizeChange?: DraggablePanelProps['onSizeChange'];
  ref?: Ref<TextAreaRef>;
  setExpand?: (expand: boolean) => void;
  topAddons?: ReactNode;
}

export interface ChatInputActionBarProps {
  leftAddons?: ReactNode;
  mobile?: boolean;
  padding?: number | string;
  ref?: Ref<HTMLDivElement>;
  rightAddons?: ReactNode;
}

export interface ChatInputAreaInnerProps extends Omit<TextAreaProps, 'onInput'> {
  className?: string;
  loading?: boolean;
  onInput?: (value: string) => void;
  onSend?: () => void;
  ref?: Ref<TextAreaRef>;
  style?: CSSProperties;
}

export interface ChatSendButtonProps extends FlexboxProps {
  className?: string;
  leftAddons?: ReactNode;
  loading?: boolean;
  onSend?: () => void;
  onStop?: () => void;
  ref?: Ref<HTMLDivElement>;
  rightAddons?: ReactNode;
  style?: CSSProperties;
  texts?: {
    send?: string;
    stop?: string;
    warp?: string;
  };
}
