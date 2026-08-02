'use client';

import { cx, useThemeMode } from 'antd-style';
import {
  memo,
  type MouseEvent,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Flexbox } from '@/Flex';
import { SkeletonAvatar } from '@/Skeleton';

import { usePreviewGroupContext } from './PreviewGroup';
import { FALLBACK_DARK, FALLBACK_LIGHT, styles, variants } from './style';
import type { ImagePreviewOptions, ImageProps } from './type';
import PreviewOutlet from './viewer/PreviewOutlet';
import { openPreview, type PreviewEntry } from './viewer/registry';

const DEFAULT_MAX_SCALE = 8;

const resolvePreview = (
  groupPreview: boolean | ImagePreviewOptions | undefined,
  imagePreview: boolean | ImagePreviewOptions | undefined,
): ImagePreviewOptions | false => {
  if (imagePreview === false) return false;
  if (imagePreview === undefined && groupPreview === false) return false;

  const groupOptions = typeof groupPreview === 'object' ? groupPreview : undefined;
  const imageOptions = typeof imagePreview === 'object' ? imagePreview : undefined;

  return { ...groupOptions, ...imageOptions };
};

const Image = memo<ImageProps>(
  ({
    ref,
    style,
    preview,
    isLoading,
    maxHeight = '100%',
    maxWidth = '100%',
    minHeight,
    minWidth,
    actions,
    className,
    alwaysShowActions,
    variant = 'filled',
    objectFit = 'cover',
    classNames,
    styles: customStyles,
    onClick,
    onError,
    width,
    height,
    size,
    src,
    alt,
    loading = 'lazy',
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const [hasError, setHasError] = useState(false);
    const lastSrcRef = useRef(src);
    const imgRef = useRef<HTMLImageElement>(null);
    const id = useId();
    const group = usePreviewGroupContext();

    if (lastSrcRef.current !== src) {
      lastSrcRef.current = src;
      if (hasError) setHasError(false);
    }

    const resolvedWidth = width ?? size;
    const resolvedHeight = height ?? size;

    const resolvedPreview = resolvePreview(group?.preview, preview);
    const previewEnabled = resolvedPreview !== false;
    const resolvedOptions = useMemo(
      () => (previewEnabled ? { maxScale: DEFAULT_MAX_SCALE, ...resolvedPreview } : undefined),
      [previewEnabled, resolvedPreview],
    );
    const previewSrc = resolvedOptions?.src;

    useEffect(() => {
      if (!group) return;
      return group.register({
        getElement: () => imgRef.current,
        id,
        options: resolvedOptions,
        previewSrc,
        src: src ?? '',
      });
    }, [group, id, src, previewSrc, resolvedOptions]);

    const handleError = useCallback(
      (event: SyntheticEvent<HTMLImageElement>) => {
        setHasError(true);
        onError?.(event);
      },
      [onError],
    );

    const handleClick = useCallback(
      (event: MouseEvent<HTMLImageElement>) => {
        onClick?.(event);
        if (!previewEnabled || !imgRef.current || !resolvedOptions) return;
        const clickedEntry: PreviewEntry = {
          element: imgRef.current,
          options: resolvedOptions,
          previewSrc,
          src: imgRef.current.currentSrc || imgRef.current.src,
        };

        if (!group) {
          openPreview(clickedEntry);
          return;
        }

        const galleryEntries: PreviewEntry[] = [];
        let clickedIndex = -1;
        for (const groupEntry of group.getEntries()) {
          const element = groupEntry.getElement();
          if (!element || !groupEntry.options) continue;
          if (element === imgRef.current) clickedIndex = galleryEntries.length;
          galleryEntries.push({
            element,
            options: groupEntry.options,
            previewSrc: groupEntry.previewSrc,
            src: element.currentSrc || element.src,
          });
        }
        openPreview(clickedEntry, galleryEntries, clickedIndex >= 0 ? clickedIndex : 0);
      },
      [onClick, previewEnabled, resolvedOptions, previewSrc, group],
    );

    const actionsClassName = alwaysShowActions ? styles.actionsVisible : styles.actionsHidden;

    if (isLoading)
      return (
        <div onClick={onClick}>
          <SkeletonAvatar
            active
            height={resolvedHeight}
            style={{ maxHeight, maxWidth, minHeight, minWidth }}
            width={resolvedWidth}
          />
        </div>
      );

    return (
      <Flexbox className={cx(variants({ variant }), className)} ref={ref} style={style}>
        {actions && (
          <div className={cx(actionsClassName, alwaysShowActions ? '' : 'actions-hidden')}>
            {actions}
          </div>
        )}
        <div className={cx(styles.wrapper, classNames?.wrapper)} style={customStyles?.wrapper}>
          <img
            alt={alt}
            className={cx(styles.image, previewEnabled && styles.previewable, classNames?.image)}
            height={resolvedHeight}
            loading={loading}
            ref={imgRef}
            src={hasError ? (isDarkMode ? FALLBACK_DARK : FALLBACK_LIGHT) : src}
            width={resolvedWidth}
            style={{
              maxHeight,
              maxWidth,
              minHeight,
              minWidth,
              objectFit,
              ...customStyles?.image,
            }}
            onClick={handleClick}
            onError={handleError}
            {...rest}
          />
        </div>
        {previewEnabled && <PreviewOutlet elementRef={imgRef} />}
      </Flexbox>
    );
  },
);

Image.displayName = 'Image';

export default Image;
