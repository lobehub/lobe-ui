'use client';

import { type CSSProperties, useState } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { domainStyles } from './domain';

interface CoverImageProps {
  alt: string;
  className?: string;
  src?: string;
  style?: CSSProperties;
}

/**
 * A cover image that renders nothing when it has no source or fails to load, so the box behind it
 * shows instead of a broken image. Adapted from CopilotKit a2ui-playground (MIT), `Img`.
 */
const CoverImage = ({ alt, className, src, style }: CoverImageProps) => {
  // Keyed to the URL that failed, so a new src still loads.
  const [failedSrc, setFailedSrc] = useState<string>();
  if (!src || failedSrc === src) return null;
  return (
    <img
      alt={alt}
      loading="lazy"
      src={src}
      onError={() => setFailedSrc(src)}
      {...styleProps(domainStyles.img, className, style)}
    />
  );
};

export default CoverImage;
