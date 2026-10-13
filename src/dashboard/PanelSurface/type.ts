import type { CSSProperties, ReactNode } from 'react';

import type { SurfaceRenderLink } from '../Surface/type';

export interface PanelSurfaceProps {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  extra?: ReactNode;
  href?: string;
  loading?: boolean;
  renderLink?: SurfaceRenderLink;
  size?: 'default' | 'small';
  style?: CSSProperties;
  title?: ReactNode;
}
