import type { HTMLAttributes, ReactNode } from 'react';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}
