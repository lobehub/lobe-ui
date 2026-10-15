'use client';

import * as stylex from '@stylexjs/stylex';

import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { PageToolbarProps } from './type';

/** Filters start at the left edge; actions hold the right edge, also after wrapping. */
const PageToolbar = ({ actions, children, className }: PageToolbarProps) => (
  <div {...styleProps(styles.root, className)}>
    {children ? <div {...stylex.props(styles.filters)}>{children}</div> : null}
    {actions ? <div {...stylex.props(styles.actions)}>{actions}</div> : null}
  </div>
);

PageToolbar.displayName = 'PageToolbar';

export default PageToolbar;
