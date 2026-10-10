'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { renderLandingIcon } from '@/awesome/landingIcon';
import { styleProps } from '@/styles/stylex/props';

import { logoMarqueeMarker } from './marker.stylex';
import { styles } from './style';
import type { LogoMarqueeProps } from './type';

const Track = ({
  hidden,
  iconOnly,
  iconSize,
  items,
}: Pick<LogoMarqueeProps, 'iconOnly' | 'items'> & { hidden?: boolean; iconSize: number }) => (
  <div aria-hidden={hidden || undefined} {...stylex.props(styles.track)}>
    {items.map(({ icon, label }) => (
      <span key={label} title={iconOnly ? label : undefined} {...stylex.props(styles.item)}>
        {renderLandingIcon(icon, iconSize)}
        {!iconOnly && label}
      </span>
    ))}
  </div>
);

const LogoMarquee = memo<LogoMarqueeProps>(
  ({
    caption,
    className,
    duration = 28,
    gap = 36,
    iconOnly = false,
    iconSize = 18,
    items,
    maxWidth = 640,
    style,
    ...rest
  }) => {
    const variables = {
      '--logo-marquee-duration': `${duration}s`,
      '--logo-marquee-gap': `${gap}px`,
      '--logo-marquee-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    } as CSSProperties;

    return (
      <div {...styleProps(styles.root, className, { ...variables, ...style })} {...rest}>
        <div {...stylex.props(logoMarqueeMarker, styles.viewport)}>
          <Track iconOnly={iconOnly} iconSize={iconSize} items={items} />
          <Track hidden iconOnly={iconOnly} iconSize={iconSize} items={items} />
        </div>
        {caption && (
          <p className={clsx('lobe-logo-marquee-caption', stylex.props(styles.caption).className)}>
            {caption}
          </p>
        )}
      </div>
    );
  },
);

LogoMarquee.displayName = 'LogoMarquee';

export default LogoMarquee;
