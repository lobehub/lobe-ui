import { CSSProperties, ReactNode } from 'react';

import { FlexboxProps } from '@/Flex';

export interface ChatHeaderProps extends FlexboxProps {
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
  right?: ReactNode;
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
