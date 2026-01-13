import type { default as GiscusComponent } from '@giscus/react';
import type { CSSProperties, ComponentProps } from 'react';

export interface GiscusProps extends ComponentProps<typeof GiscusComponent> {
  className?: string;
  style?: CSSProperties;
}
