'use client';

import './style.css';

import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { renderLandingIcon } from '@/awesome/landingIcon';
import { styleProps } from '@/styles/stylex/props';

import { logoMarqueeMarker } from './marker.stylex';
import { awesomeLogoMarqueeClasses } from './stable';
import { styles } from './style';
import type { LogoMarqueeProps } from './type';

const Track = ({
  hidden,
  iconOnly,
  iconSize,
  items,
}: Pick<LogoMarqueeProps, 'iconOnly' | 'items'> & { hidden?: boolean; iconSize: number }) => (
  <div
    aria-hidden={hidden || undefined}
    {...styleProps(styles.track, awesomeLogoMarqueeClasses('track'))}
  >
    {items.map(({ icon, label }) => (
      <span
        key={label}
        title={iconOnly ? label : undefined}
        {...styleProps(styles.item, awesomeLogoMarqueeClasses('item'))}
      >
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
    duration,
    gap,
    iconOnly = false,
    iconSize = 18,
    items,
    maxWidth,
    style,
    ...rest
  }) => {
    const variables = {
      ...(duration === undefined ? undefined : { '--logo-marquee-duration': `${duration}s` }),
      ...(gap === undefined ? undefined : { '--logo-marquee-gap': `${gap}px` }),
      ...(maxWidth === undefined
        ? undefined
        : {
            '--logo-marquee-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          }),
    } as CSSProperties;

    return (
      <div
        {...styleProps(styles.root, clsx(awesomeLogoMarqueeClasses(), className), {
          ...variables,
          ...style,
        })}
        {...rest}
      >
        <div
          {...styleProps(
            [logoMarqueeMarker, styles.viewport],
            awesomeLogoMarqueeClasses('viewport'),
          )}
        >
          <Track iconOnly={iconOnly} iconSize={iconSize} items={items} />
          <Track hidden iconOnly={iconOnly} iconSize={iconSize} items={items} />
        </div>
        {caption && (
          <p
            className={clsx(
              'lobe-logo-marquee-caption',
              styleProps(styles.caption, awesomeLogoMarqueeClasses('caption')).className,
            )}
          >
            {caption}
          </p>
        )}
      </div>
    );
  },
);

LogoMarquee.displayName = 'LogoMarquee';

export default LogoMarquee;
