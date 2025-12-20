import type { ImageProps as AntdImageProps } from 'antd';
import type { PreviewConfig } from 'antd/es/image';
import type { GroupPreviewConfig } from 'antd/es/image/PreviewGroup';
import type { CSSProperties, ReactNode, Ref } from 'react';

export interface PreviewGroupPreviewOptions extends GroupPreviewConfig {
  toolbarAddon?: ReactNode;
}

export interface PreviewGroupProps {
  children?: ReactNode;
  enable?: boolean;
  items?: string[];
  preview?: boolean | PreviewGroupPreviewOptions;
}

export interface ImagePreviewOptions extends PreviewConfig {
  toolbarAddon?: ReactNode;
}

export interface ImageProps extends Omit<AntdImageProps, 'preview'> {
  actions?: ReactNode;
  alwaysShowActions?: boolean;
  classNames?: {
    image?: string;
    wrapper?: string;
  };
  isLoading?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  objectFit?: 'cover' | 'contain';
  preview?: boolean | ImagePreviewOptions;
  ref?: Ref<HTMLDivElement>;
  size?: number | string;
  styles?: {
    image?: CSSProperties;
    wrapper?: CSSProperties;
  };
  toolbarAddon?: ReactNode;
  variant?: 'borderless' | 'filled' | 'outlined';
}
