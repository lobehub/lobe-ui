'use client';

import { cx } from 'antd-style';
import { type CSSProperties, memo } from 'react';

import { renderLandingIcon } from '@/awesome/landingIcon';

import { styles } from './style';
import type { LogoMarqueeProps } from './type';

const Track = ({
  hidden,
  iconOnly,
  iconSize,
  items,
}: Pick<LogoMarqueeProps, 'iconOnly' | 'items'> & { hidden?: boolean; iconSize: number }) => (
  <div aria-hidden={hidden || undefined} className={styles.track}>
    {items.map(({ icon, label }) => (
      <span className={styles.item} key={label} title={iconOnly ? label : undefined}>
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
      <div className={cx(styles.root, className)} style={{ ...variables, ...style }} {...rest}>
        <div className={styles.viewport}>
          <Track iconOnly={iconOnly} iconSize={iconSize} items={items} />
          <Track hidden iconOnly={iconOnly} iconSize={iconSize} items={items} />
        </div>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    );
  },
);

LogoMarquee.displayName = 'LogoMarquee';

export default LogoMarquee;
