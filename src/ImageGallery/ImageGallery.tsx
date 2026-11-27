'use client';

import clsx from 'clsx';
import { memo } from 'react';

import Image, { PreviewGroup } from '@/Image';
import { styleProps } from '@/styles/stylex/props';

import { imageGalleryClasses } from './stable';
import { styles } from './style';
import type { ImageGalleryProps } from './type';

/** Fills its tile: the lobe-ui `Image` sizes to its content by default. */
const FILL = { height: '100%', width: '100%' } as const;

/**
 * A grid of captioned images; with more than three images the first can take a 2×2 feature
 * tile. Click an image to open the lobe-ui viewer with the rest of the gallery. lobe-ui tiles
 * (`default`) or the A2UI playground gallery (`a2ui`). Adapted from CopilotKit a2ui-playground
 * (MIT), `renderers/content.tsx` ImageGallery.
 */
const ImageGallery = memo<ImageGalleryProps>(
  ({
    className,
    classNames,
    columns: columnsProp = 3,
    images: imagesProp,
    preview = true,
    ref,
    style,
    styles: customStyles,
    variant = 'default',
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const images = (imagesProp ?? []).filter((image) => image && image.url);
    const columns = Math.min(4, Math.max(2, Math.round(columnsProp)));
    // The first image takes a 2×2 tile when that leaves the last row full.
    const hasFeature = images.length > 3 && (images.length + 3) % columns === 0;

    return (
      <PreviewGroup enable={preview !== false} preview={preview}>
        <div
          ref={ref}
          {...rest}
          {...styleProps(styles.root, clsx(imageGalleryClasses(), className, classNames?.root), {
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            ...style,
            ...customStyles?.root,
          })}
          data-variant={variant}
        >
          {images.map((image, i) => {
            const isFeature = hasFeature && i === 0;
            const tile = (
              <Image
                alt={image.alt ?? image.caption ?? ''}
                height="100%"
                maxHeight="none"
                objectFit="cover"
                preview={preview === false ? false : undefined}
                src={image.url}
                style={FILL}
                styles={{ wrapper: FILL }}
                variant="borderless"
                width="100%"
                classNames={{
                  image: clsx(
                    imageGalleryClasses('image'),
                    styleProps(isA2ui && styles.image).className,
                  ),
                }}
              />
            );
            if (isA2ui)
              return (
                <figure
                  key={`${image.url}-${i}`}
                  {...styleProps(
                    [styles.item, styles.square, isFeature && styles.feature],
                    clsx(imageGalleryClasses('item'), classNames?.item),
                    customStyles?.item,
                  )}
                >
                  {tile}
                  {image.caption ? (
                    <figcaption
                      {...styleProps(
                        styles.caption,
                        clsx(imageGalleryClasses('caption'), classNames?.caption),
                        customStyles?.caption,
                      )}
                    >
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              );
            return (
              <figure
                key={`${image.url}-${i}`}
                {...styleProps([styles.dFigure, isFeature && styles.feature])}
              >
                <div
                  {...styleProps(
                    [styles.item, styles.dItem, isFeature ? styles.dFeatureItem : styles.square],
                    clsx(imageGalleryClasses('item'), classNames?.item),
                    customStyles?.item,
                  )}
                >
                  {tile}
                </div>
                {image.caption ? (
                  <figcaption
                    {...styleProps(
                      styles.dCaption,
                      clsx(imageGalleryClasses('caption'), classNames?.caption),
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

ImageGallery.displayName = 'ImageGallery';

export default ImageGallery;
