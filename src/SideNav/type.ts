import type { ReactNode } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

export interface SideNavProps extends FlexboxProps {
  avatar?: ReactNode;
  bottomActions: ReactNode;
  topActions?: ReactNode;
}
