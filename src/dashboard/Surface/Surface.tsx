'use client';

import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { SurfaceProps } from './type';

/**
 * Elevated card on a workspace canvas. Use it for panels that should read
 * above the page background without inventing a new surface color.
 */
function Surface({ className, style, ...rest }: SurfaceProps) {
  return <div {...styleProps(styles.card, className, style)} {...rest} />;
}

Surface.displayName = 'Surface';

export default Surface;
