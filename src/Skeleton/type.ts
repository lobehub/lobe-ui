import type { CSSProperties } from 'react';

export interface SkeletonBlockProps {
  active?: boolean;
  className?: string;
  height?: number | string;
  style?: CSSProperties;
  width?: number | string;
}

export interface SkeletonTitleProps extends Omit<SkeletonBlockProps, 'height'> {
  fontSize?: number;
  height?: number;
  lineHeight?: number;
  width?: number | string;
}

export interface SkeletonParagraphProps extends Omit<SkeletonBlockProps, 'width' | 'height'> {
  fontSize?: number;
  gap?: number;
  height?: number;
  lineHeight?: number;
  rows?: number;
  width?: number | string | (number | string)[];
}

export interface SkeletonTagsProps extends Omit<SkeletonBlockProps, 'width'> {
  count?: number;
  gap?: number;
  size?: 'small' | 'middle' | 'large';
  width?: number | string | (number | string)[];
}

export interface SkeletonAvatarProps extends SkeletonBlockProps {
  shape?: 'circle' | 'square';
  size?: number | string;
}

export interface SkeletonButtonProps extends SkeletonBlockProps {
  block?: boolean;
  shape?: 'circle' | 'round' | 'default';
  size?: 'large' | 'small' | 'default';
}

export interface SkeletonProps extends SkeletonBlockProps {
  avatar?: SkeletonAvatarProps | boolean;
  classNames?: {
    avatar?: string;
    paragraph?: string;
    root?: string;
    title?: string;
  };
  gap?: number;
  paragraph?: SkeletonParagraphProps | boolean;
  styles?: {
    avatar?: CSSProperties;
    paragraph?: CSSProperties;
    root?: CSSProperties;
    title?: CSSProperties;
  };
  title?: SkeletonTitleProps | boolean;
}
