import type { CSSProperties, ReactNode, Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

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
