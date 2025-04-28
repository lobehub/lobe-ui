import type { FooterProps as RcProps } from 'rc-footer';
import type { ReactNode } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

export interface FooterProps extends FlexboxProps {
  bottom?: ReactNode;
  columns: RcProps['columns'];
  contentMaxWidth?: number;
  theme?: 'light' | 'dark';
}
