'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { memo } from 'react';

import Image, { PreviewGroup } from '@/Image';
import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { imageGridClasses } from './stable';
import type { ImageGridProps } from './type';

// Adapted from CopilotKit `@copilotkit/react-core` (MIT), Gen UI standard `ImageGrid`.
const styles = stylex.create({
  caption: {
    color: a2ui.fgMuted,
    fontSize: 12,
    lineHeight: 1.333,
  },
  dCaption: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
    lineHeight: cssVar.lineHeightSM,
  },
  dTile: {
    borderRadius: cssVar.borderRadiusLG,
  },
  figure: {
    gap: 4,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  lead: {
    flex: '1',
  },
  link: {
    display: 'block',
    blockSize: '100%',
  },
  root: {
    display: 'grid',
    inlineSize: '100%',
  },
  tile: {
    overflow: 'hidden',
    borderRadius: 8,
    minInlineSize: 0,
  },
});

const FILL = { height: '100%', width: '100%' } as const;

/** Only http(s) and mailto links open; anything else (javascript:, data:) is ignored. */
const safeHref = (href?: string) =>
  href && /^(https?:|mailto:)/i.test(href.trim()) ? href.trim() : undefined;

/**
 * A grid of images with optional captions. A click opens the lobe-ui image viewer with the other
 * images a swipe away, or the image's `href`. `layout="bento"` makes the first image twice as
 * large. lobe-ui tiles (`default`) or the CopilotKit Gen UI standard grid (`a2ui`).
 */
const ImageGrid = memo<ImageGridProps>(
  ({
    aspectRatio = '1 / 1',
    className,
    classNames,
    columns: columnsProp = 3,
    gap = 2,
    images: imagesProp,
    layout = 'grid',
    preview = true,
    ref,
    style,
    styles: customStyles,
    variant = 'default',
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const images = (imagesProp ?? []).filter((image) => image && image.url);
    if (images.length === 0) return null;
    const columns = Math.max(1, Math.floor(columnsProp));
    const isBento = layout === 'bento' && images.length > 1;

    return (
      <PreviewGroup enable={preview !== false} preview={preview}>
        <div
          ref={ref}
          {...rest}
          {...styleProps(styles.root, clsx(imageGridClasses(), className, classNames?.root), {
            gap: typeof gap === 'number' ? gap * 4 : gap,
            gridAutoFlow: isBento ? 'dense' : undefined,
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            ...style,
            ...customStyles?.root,
          })}
          data-layout={isBento ? 'bento' : 'grid'}
          data-variant={variant}
        >
          {images.map((image, index) => {
            const isLead = isBento && index === 0;
            const href = safeHref(image.href);
            const img = (
              <Image
                alt={image.description ?? image.caption ?? ''}
                classNames={{ image: clsx(imageGridClasses('image'), classNames?.image) }}
                height="100%"
                maxHeight="none"
                objectFit="cover"
                preview={href || preview === false ? false : undefined}
                src={image.url}
                style={{ ...FILL, borderRadius: 'inherit' }}
                styles={{ image: customStyles?.image, wrapper: FILL }}
                variant={isA2ui ? 'borderless' : 'filled'}
                width="100%"
              />
            );
            return (
              <figure
                key={`${image.url}-${index}`}
                {...styleProps(styles.figure, clsx(imageGridClasses('item'), classNames?.item), {
                  gridColumn: isLead ? `span ${Math.min(2, columns)}` : undefined,
                  gridRow: isLead ? 'span 2' : undefined,
                  ...customStyles?.item,
                })}
              >
                <div
                  {...styleProps(
                    [styles.tile, !isA2ui && styles.dTile, isLead && styles.lead],
                    undefined,
                    {
                      aspectRatio: isLead ? undefined : aspectRatio,
                    },
                  )}
                >
                  {href ? (
                    <a
                      href={href}
                      rel="noopener noreferrer"
                      target="_blank"
                      {...styleProps(styles.link)}
                    >
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </div>
                {image.caption ? (
                  <figcaption
                    {...styleProps(
                      isA2ui ? styles.caption : styles.dCaption,
                      clsx(imageGridClasses('caption'), classNames?.caption),
                      customStyles?.caption,
                    )}
                  >
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </PreviewGroup>
    );
  },
);

ImageGrid.displayName = 'ImageGrid';

export default ImageGrid;
