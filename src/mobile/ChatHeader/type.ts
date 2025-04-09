import { CSSProperties, ReactNode, Ref } from 'react';
import { FlexboxProps } from 'react-layout-kit';

export interface ChatHeaderProps extends FlexboxProps {
  center?: ReactNode;
  classNames?: {
    center?: string;
    left?: string;
    right?: string;
  };
  gaps?: {
    center?: number;
    left?: number;
    right?: number;
  };
  left?: ReactNode;
  onBackClick?: () => void;
  ref?: Ref<HTMLDivElement>;
  right?: ReactNode;
  safeArea?: boolean;
  showBackButton?: boolean;
  styles?: {
    center?: CSSProperties;
    left?: CSSProperties;
    right?: CSSProperties;
  };
}

export interface ChatHeaderTitleProps {
  desc?: string | ReactNode;
  tag?: ReactNode;
  title: string | ReactNode;
}
