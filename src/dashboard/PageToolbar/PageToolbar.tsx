'use client';

import { cx } from 'antd-style';

import { styles } from './style';
import type { PageToolbarProps } from './type';

/** Filters start at the left edge; actions hold the right edge, also after wrapping. */
const PageToolbar = ({ actions, children, className }: PageToolbarProps) => (
  <div className={cx(styles.root, className)}>
    {children ? <div className={styles.filters}>{children}</div> : null}
    {actions ? <div className={styles.actions}>{actions}</div> : null}
  </div>
);

PageToolbar.displayName = 'PageToolbar';

export default PageToolbar;
