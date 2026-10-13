'use client';

import { cx } from 'antd-style';

import Skeleton from '@/base-ui/Skeleton';
import Spin from '@/base-ui/Spin';

import { styles as surfaceStyles } from '../Surface/style';
import Surface from '../Surface/Surface';
import { styles } from './style';
import type { PanelSurfaceProps } from './type';

/** Titled console panel. Body padding stays inside so a trailing table can bleed to the edges. */
const PanelSurface = ({
  title,
  description,
  extra,
  href,
  loading,
  renderLink,
  size = 'default',
  className,
  style,
  children,
}: PanelSurfaceProps) => (
  <Surface
    className={className}
    description={description}
    extra={loading && children ? <Spin size="small" /> : extra}
    href={href}
    padded={false}
    renderLink={renderLink}
    style={style}
    title={title}
  >
    {loading && !children ? (
      <div aria-busy="true" className={styles.loadingBody}>
        <Skeleton height={220} radius={8} />
      </div>
    ) : (
      <div
        className={cx(size === 'small' ? styles.bodySmall : styles.body, surfaceStyles.tableBleed)}
      >
        {children}
      </div>
    )}
  </Surface>
);

PanelSurface.displayName = 'PanelSurface';

export default PanelSurface;
