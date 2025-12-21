import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { FooterProps as RcProps } from 'rc-footer';
import type { ReactNode } from 'react';

export interface FooterProps extends FlexboxProps {
  bottom?: ReactNode;
  columns: RcProps['columns'];
  contentMaxWidth?: number;
  theme?: 'light' | 'dark';
}
