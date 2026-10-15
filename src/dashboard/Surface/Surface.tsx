'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

import Skeleton from '@/Skeleton';
import Spin from '@/Spin';
import { styleProps } from '@/styles/stylex/props';

import { SurfaceDepthContext, useSurfaceCardStyles, useSurfaceDepth, useSurfaceLink } from './link';
import { surfaceMarker } from './marker.stylex';
import { styles, surfaceClassNames } from './style';
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
  style,
  title,
  ...rest
}: SurfaceProps) {
  const depth = useSurfaceDepth();
  const link = useSurfaceLink(renderLink);
  const cardStyles = useSurfaceCardStyles();
  const refreshing = Boolean(loading) && defined(children);
  const placeholder = Boolean(loading) && !defined(children);
  const hasHeader = defined(title) || defined(description) || defined(extra) || refreshing;
  const pad = bleed ? false : (padded ?? (hasHeader || placeholder));

  const heading = (
    <div {...stylex.props(styles.heading)}>
      {defined(title) ? <div {...stylex.props(styles.title)}>{title}</div> : null}
      {defined(description) ? <div {...stylex.props(styles.desc)}>{description}</div> : null}
    </div>
  );

  const body = placeholder ? (
    <div aria-busy="true" {...stylex.props(styles.loading)}>
      <Skeleton height={220} radius={8} />
    </div>
  ) : (
    children
  );

  // With header actions, the arrow sits after them as the rightmost item.
  const trailing = refreshing || defined(extra);
  const arrow = (
    <ArrowUpRight
      aria-hidden
      size={16}
      {...stylex.props(styles.arrow, trailing && styles.arrowInLink)}
    />
  );

  return (
    <SurfaceDepthContext value={depth + 1}>
      <div
        {...styleProps(
          [
            cardStyles,
            styles.content,
            styles.clip,
            Boolean(href) && [styles.cardLinked, surfaceMarker],
          ],
          clsx(surfaceClassNames.root, bleed && surfaceClassNames.bleed, className),
          style,
        )}
        {...rest}
      >
        {hasHeader ? (
          <div {...stylex.props(styles.header)}>
            {href
              ? link({
                  children: (
                    <>
                      {heading}
                      {trailing ? null : arrow}
                    </>
                  ),
                  className: stylex.props(styles.headingLink).className,
                  href,
                })
              : heading}
            {trailing ? (
              <div {...stylex.props(styles.extra)}>
                {refreshing ? <Spin size="small" variant="network" /> : null}
                {extra}
                {href
                  ? link({
                      'aria-hidden': true,
                      'children': arrow,
                      'className': stylex.props(styles.arrowLink).className,
                      href,
                      'tabIndex': -1,
                    } as any)
                  : null}
              </div>
            ) : null}
          </div>
        ) : null}
        {pad ? <div {...styleProps(styles.body, surfaceClassNames.tableBleed)}>{body}</div> : body}
        {defined(chart) ? <div {...stylex.props(styles.chart)}>{chart}</div> : null}
      </div>
    </SurfaceDepthContext>
  );
}

Surface.displayName = 'Surface';

export default Surface;
