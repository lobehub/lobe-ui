'use client';

import clsx from 'clsx';

import Skeleton from '@/Skeleton';
import Spin from '@/Spin';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { surfaceClassNames } from '../Surface/style';
import Surface from '../Surface/Surface';
import { dashboardPanelSurfaceClasses } from './stable';
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
    className={clsx(dashboardPanelSurfaceClasses(), className)}
    description={description}
    extra={loading && children ? <Spin size="small" variant="network" /> : extra}
    href={href}
    padded={false}
    renderLink={renderLink}
    style={style}
    title={title}
    {...toDataAttributes({ size })}
  >
    {loading && !children ? (
      <div
        aria-busy="true"
        {...styleProps(styles.loadingBody, dashboardPanelSurfaceClasses('loading'))}
      >
        <Skeleton height={220} radius={8} />
      </div>
    ) : (
      <div
        {...styleProps(
          size === 'small' ? styles.bodySmall : styles.body,
          clsx(dashboardPanelSurfaceClasses('body'), surfaceClassNames.tableBleed),
        )}
      >
        {children}
      </div>
    )}
  </Surface>
);

PanelSurface.displayName = 'PanelSurface';

export default PanelSurface;
