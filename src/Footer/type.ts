import type { FooterProps as RcProps } from 'rc-footer';
import type { ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface FooterProps extends FlexboxProps {
  bottom?: ReactNode;
  columns: RcProps['columns'];
  contentMaxWidth?: number;
  theme?: 'light' | 'dark';
}
