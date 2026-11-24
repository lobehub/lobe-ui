'use client';

import clsx from 'clsx';
import { Globe } from 'lucide-react';
import { type CSSProperties, type FC, useState } from 'react';

import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { faviconClasses } from './stable';
import { styles } from './style';
import type { FaviconProps } from './type';
import { defaultFaviconUrl, getFaviconHost } from './utils';

/**
 * The icon of a website, looked up by host. A host that cannot be resolved, or an
 * icon that fails to load, quietly becomes a globe instead of a broken image.
 */
const Favicon: FC<FaviconProps> = ({
  alt = '',
  className,
  classNames,
  fallback,
  getIconUrl = defaultFaviconUrl,
  host,
  ref,
  shape = 'square',
  size = 16,
  src,
  style,
  url,
  ...rest
}) => {
  const resolvedHost = host || getFaviconHost(url);
  const iconUrl = src || (resolvedHost ? getIconUrl(resolvedHost) : undefined);
  // Remember which URL failed, so a new source gets a fresh attempt.
  const [failedUrl, setFailedUrl] = useState<string>();
  const failed = !iconUrl || failedUrl === iconUrl;

  return (
    <span
      ref={ref}
      {...styleProps(
        [styles.root, shape === 'circle' ? styles.circle : styles.square],
        clsx(faviconClasses(), className),
        {
          '--lobe-favicon-size': `${size}px`,
          'height': size,
          'width': size,
          ...style,
        } as CSSProperties,
      )}
      {...toDataAttributes({ fallback: failed, shape })}
      {...rest}
    >
      {failed ? (
        (fallback ?? <Icon icon={Globe} size={size} />)
      ) : (
        <img
          alt={alt}
          draggable={false}
          height={size}
          loading="lazy"
          src={iconUrl}
          width={size}
          {...styleProps(styles.image, clsx(faviconClasses('image'), classNames?.image))}
          onError={() => setFailedUrl(iconUrl)}
        />
      )}
    </span>
  );
};

Favicon.displayName = 'Favicon';

export default Favicon;
