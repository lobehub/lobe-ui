'use client';

import { type ReactNode, type RefObject, useCallback, useMemo } from 'react';

import type { ImagePreviewOptions } from './type';
import { DEFAULT_AUTO_ZOOM_THRESHOLD, DEFAULT_MAX_SCALE } from './viewer/geometry';
import PreviewOutlet from './viewer/PreviewOutlet';
import { openPreview, type ResolvedPreviewOptions } from './viewer/registry';

export interface UseImagePreviewResult {
  open: () => void;
  outlet: ReactNode;
}

export const useImagePreview = (
  elementRef: RefObject<HTMLImageElement | null>,
  options?: ImagePreviewOptions,
): UseImagePreviewResult => {
  const resolvedOptions = useMemo<ResolvedPreviewOptions>(
    () => ({
      autoZoomThreshold: DEFAULT_AUTO_ZOOM_THRESHOLD,
      defaultZoom: 'auto',
      maxScale: DEFAULT_MAX_SCALE,
      ...options,
    }),
    [options],
  );

  const open = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    const active = document.activeElement;
    openPreview(
      {
        element,
        options: resolvedOptions,
        previewSrc: resolvedOptions.src,
        src: element.currentSrc || element.src,
      },
      undefined,
      0,
      active instanceof HTMLElement && active !== document.body ? active : null,
    );
  }, [elementRef, resolvedOptions]);

  return { open, outlet: <PreviewOutlet elementRef={elementRef} /> };
};
