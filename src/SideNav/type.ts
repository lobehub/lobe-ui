import type { ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface SideNavProps extends FlexboxProps {
  avatar?: ReactNode;
  bottomActions: ReactNode;
  topActions?: ReactNode;
}
