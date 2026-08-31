import type { HTMLAttributes } from 'react';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  animated?: boolean;
  height?: number | string;
  radius?: number | string;
  width?: number | string;
}

export interface SkeletonTextProps extends Omit<SkeletonProps, 'width' | 'height'> {
  fontSize?: number;
  gap?: number;
  lineHeight?: number;
  rows?: number;
  width?: number | string | (number | string)[];
}

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'radius'> {
  shape?: 'circle' | 'square';
  size?: number | string;
}
