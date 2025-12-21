import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { CSSProperties, ReactNode, Ref } from 'react';

export interface HeaderProps extends FlexboxProps {
  actions?: ReactNode;
  actionsClassName?: string;
  actionsStyle?: CSSProperties;
  logo?: ReactNode;
  logoClassName?: string;
  logoStyle?: CSSProperties;
  nav?: ReactNode;
  navClassName?: string;
  navStyle?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}
