'use client';

import { cx } from 'antd-style';

import { styles } from './style';
import type { SurfaceProps } from './type';

/**
 * Elevated card on a workspace canvas. Use it for panels that should read
 * above the page background without inventing a new surface color.
 */
function Surface({ className, ...rest }: SurfaceProps) {
  return <div className={cx(styles.card, className)} {...rest} />;
}

Surface.displayName = 'Surface';

export default Surface;
