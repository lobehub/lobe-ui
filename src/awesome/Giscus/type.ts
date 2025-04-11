import type { GiscusProps as GiscusComponentProps } from '@giscus/react/dist/types';
import type { CSSProperties } from 'react';

export interface GiscusProps extends GiscusComponentProps {
  className?: string;
  style?: CSSProperties;
}
