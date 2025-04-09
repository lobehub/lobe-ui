import type { ImagePreviewType } from 'rc-image';
import type { ImageProps as AntImageProps } from 'rc-image/lib/Image';
import { GroupConsumerProps } from 'rc-image/lib/PreviewGroup';
import type { CSSProperties, ReactNode, Ref } from 'react';

export interface PreviewOptions extends ImagePreviewType {
  toolbarAddon?: ReactNode;
}

export interface PreviewGroupProps extends GroupConsumerProps {
  enable?: boolean;
  items?: string[];
  preview?: PreviewOptions;
}

export interface ImageProps extends AntImageProps {
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
  preview?: boolean | PreviewOptions;
  ref?: Ref<HTMLDivElement>;
  size?: number | string;
  styles?: {
    image?: CSSProperties;
    wrapper?: CSSProperties;
  };
  toolbarAddon?: ReactNode;
  variant?: 'borderless' | 'filled' | 'outlined';
}
