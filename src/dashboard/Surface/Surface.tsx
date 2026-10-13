'use client';

import { cx } from 'antd-style';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

import Skeleton from '@/base-ui/Skeleton';
import Spin from '@/base-ui/Spin';

import { SurfaceDepthContext, useSurfaceDepth, useSurfaceLink } from './link';
import { styles } from './style';
import type { SurfaceProps } from './type';

const defined = (node: ReactNode) => node !== null && node !== undefined && node !== false;

/**
 * Elevated card on a workspace canvas. Bare, it is a plain frame. With `title`,
 * `description` or `extra` it gets a header and a padded body that lets a
 * trailing table meet the card edges.
 */
function Surface({
  bleed = false,
  chart,
  children,
  className,
  description,
  extra,
  href,
  loading,
  padded,
  renderLink,
  title,
  ...rest
}: SurfaceProps) {
  const depth = useSurfaceDepth();
  const link = useSurfaceLink(renderLink);
  const refreshing = Boolean(loading) && defined(children);
  const placeholder = Boolean(loading) && !defined(children);
  const hasHeader = defined(title) || defined(description) || defined(extra) || refreshing;
  const pad = bleed ? false : (padded ?? (hasHeader || placeholder));
  const clip = hasHeader || bleed || pad || defined(chart);

  const heading = (
    <div className={styles.heading}>
      {defined(title) ? <div className={styles.title}>{title}</div> : null}
      {defined(description) ? <div className={styles.desc}>{description}</div> : null}
    </div>
  );

  const body = placeholder ? (
    <div aria-busy="true" className={styles.loading}>
      <Skeleton height={220} radius={8} />
    </div>
  ) : (
    children
  );

  return (
    <SurfaceDepthContext value={depth + 1}>
      <div
        className={cx(
          styles.card,
          styles.content,
          clip && styles.clip,
          href && styles.cardLinked,
          bleed && styles.bleed,
          className,
        )}
        {...rest}
      >
        {hasHeader ? (
          <div className={styles.header}>
            {href
              ? link({
                  children: (
                    <>
                      {heading}
                      <ArrowUpRight
                        aria-hidden
                        data-surface-arrow
                        className={styles.arrow}
                        size={16}
                      />
                    </>
                  ),
                  className: styles.headingLink,
                  href,
                })
              : heading}
            {refreshing || defined(extra) ? (
              <div className={styles.extra}>
                {refreshing ? <Spin size="small" /> : null}
                {extra}
              </div>
            ) : null}
          </div>
        ) : null}
        {pad ? <div className={cx(styles.body, styles.tableBleed)}>{body}</div> : body}
        {defined(chart) ? <div className={styles.chart}>{chart}</div> : null}
      </div>
    </SurfaceDepthContext>
  );
}

Surface.displayName = 'Surface';

export default Surface;
