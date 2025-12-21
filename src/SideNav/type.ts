import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { ReactNode } from 'react';

export interface SideNavProps extends FlexboxProps {
  avatar?: ReactNode;
  bottomActions: ReactNode;
  topActions?: ReactNode;
}
