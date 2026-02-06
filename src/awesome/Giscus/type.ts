import { type default as GiscusComponent } from '@giscus/react';
import { type ComponentProps, type CSSProperties } from 'react';

export interface GiscusProps extends ComponentProps<typeof GiscusComponent> {
  className?: string;
  style?: CSSProperties;
}
