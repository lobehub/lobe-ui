import type { CSSProperties, ReactNode, Ref } from 'react';

import type { DraggablePanelProps } from '@/base-ui/DraggablePanel';
import type { TextAreaProps } from '@/base-ui/Input';
import type { FlexboxProps } from '@/Flex';

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
  ref?: Ref<HTMLTextAreaElement>;
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
  ref?: Ref<HTMLTextAreaElement>;
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
