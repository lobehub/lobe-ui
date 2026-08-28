import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

import type { ZoomPolicy } from './viewer/geometry';

export interface ImagePreviewOptions {
  autoZoomThreshold?: number;
  defaultZoom?: ZoomPolicy;
  maxScale?: number;
  onDownload?: (source: string) => void | Promise<void>;
  onOpenChange?: (open: boolean) => void;
  src?: string;
  toolbarAddon?: ReactNode;
}

export type ImageProps = Omit<ComponentProps<'img'>, 'width' | 'height'> & {
  actions?: ReactNode;
  alwaysShowActions?: boolean;
  classNames?: { image?: string; wrapper?: string };
  height?: number | string;
  isLoading?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  objectFit?: 'cover' | 'contain';
  preview?: boolean | ImagePreviewOptions;
  ref?: Ref<HTMLDivElement>;
  size?: number | string;
  styles?: { image?: CSSProperties; wrapper?: CSSProperties };
  variant?: 'borderless' | 'filled' | 'outlined';
  width?: number | string;
};

export interface PreviewGroupProps {
  children?: ReactNode;
  enable?: boolean;
  preview?: boolean | ImagePreviewOptions;
}
