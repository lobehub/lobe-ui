'use client';

import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import {
  memo,
  type MouseEvent,
  type SyntheticEvent,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ActionIcon from '@/ActionIcon';
import { useLayerZIndex } from '@/base-ui/zIndex';
import imageMessages from '@/i18n/resources/en/image';
import { useTranslation } from '@/i18n/useTranslation';
import { MotionComponent } from '@/MotionProvider';
import { useAppElement } from '@/ThemeProvider';

import { styles } from '../style';
import { computeFit, type Size } from './geometry';
import { beginClosePreview, endClosePreview, type PreviewEntry } from './registry';
import { useFlipTransition } from './useFlipTransition';
import { useZoomPan } from './useZoomPan';

export interface ImageViewerProps {
  entry: PreviewEntry;
  token: number;
}

const readViewport = (): Size => ({ height: window.innerHeight, width: window.innerWidth });

const readNatural = (element: HTMLImageElement): Size => {
  if (element.naturalWidth > 0 && element.naturalHeight > 0)
    return { height: element.naturalHeight, width: element.naturalWidth };
  const rect = element.getBoundingClientRect();
  return { height: Math.max(rect.height, 1), width: Math.max(rect.width, 1) };
};

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const ImageViewer = memo<ImageViewerProps>(({ entry, token }) => {
  const { element, options, previewSrc, src } = entry;
  const { t } = useTranslation(imageMessages);
  const appElement = useAppElement();
  const motionComponent = use(MotionComponent);
  const [animated] = useState(() => !!motionComponent && !prefersReducedMotion());

  const { ref: layerRef, zIndex } = useLayerZIndex<HTMLDivElement>('modal');

  const [source, setSource] = useState(src);
  const [natural, setNatural] = useState<Size>(() => readNatural(element));
  const [viewport, setViewport] = useState<Size>(readViewport);

  const fitRect = useMemo(() => computeFit(natural, viewport, 0), [natural, viewport]);
  const fitRectRef = useRef(fitRect);
  fitRectRef.current = fitRect;
  const getFitRect = useCallback(() => fitRectRef.current, []);

  const closeRef = useRef<(() => void) | null>(null);
  const requestClose = useCallback(() => closeRef.current?.(), []);

  const {
    flipX,
    flipY,
    rotate,
    scale,
    setNatural: syncZoomNatural,
    setViewport: syncZoomViewport,
    x,
    y,
  } = useZoomPan({
    maxScale: options.maxScale,
    natural,
    onCloseRequest: requestClose,
    viewport,
  });

  const transform = useMemo(
    () => ({ flipX, flipY, rotate, scale, x, y }),
    [flipX, flipY, rotate, scale, x, y],
  );

  const handleClosed = useCallback(() => {
    endClosePreview(token);
  }, [token]);

  const { backdropRef, chromeRef, close, imageRef } = useFlipTransition({
    animated,
    getFitRect,
    onClosed: handleClosed,
    source: element,
    transform,
  });

  const handleClose = useCallback(() => {
    beginClosePreview(token);
    close();
  }, [close, token]);
  closeRef.current = handleClose;

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open) handleClose();
    },
    [handleClose],
  );

  const handleChromeClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  const handleLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      const loaded = event.currentTarget;
      if (!loaded.naturalWidth || !loaded.naturalHeight) return;
      const next = { height: loaded.naturalHeight, width: loaded.naturalWidth };
      setNatural((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next,
      );
      syncZoomNatural(next);
    },
    [syncZoomNatural],
  );

  useEffect(() => {
    const handleResize = () => {
      const next = readViewport();
      setViewport(next);
      syncZoomViewport(next);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [syncZoomViewport]);

  useEffect(() => {
    if (!previewSrc || previewSrc === src) return;
    let cancelled = false;
    const loader = new window.Image();
    const handleLoaded = () => {
      if (!cancelled) setSource(previewSrc);
    };
    loader.addEventListener('load', handleLoaded);
    loader.src = previewSrc;
    return () => {
      cancelled = true;
      loader.removeEventListener('load', handleLoaded);
    };
  }, [previewSrc, src]);

  useEffect(
    () => () => {
      const thumbnailWasRemoved = !element.isConnected;
      if (thumbnailWasRemoved) endClosePreview(token);
    },
    [element, token],
  );

  return (
    <Dialog.Root modal open onOpenChange={handleDialogOpenChange}>
      <Dialog.Portal container={appElement ?? undefined}>
        <Dialog.Backdrop
          className={styles.viewerBackdrop}
          ref={backdropRef}
          style={zIndex === undefined ? undefined : { zIndex }}
          onClick={handleClose}
        />
        <Dialog.Popup
          aria-label={element.alt || undefined}
          className={styles.viewerPopup}
          ref={layerRef}
          style={zIndex === undefined ? undefined : { zIndex: zIndex + 1 }}
          onClick={handleClose}
        >
          <img
            alt={element.alt}
            className={styles.viewerImage}
            ref={imageRef}
            src={source}
            style={{
              height: fitRect.height,
              left: fitRect.x,
              top: fitRect.y,
              width: fitRect.width,
            }}
            onLoad={handleLoad}
          />
          <div className={styles.viewerChrome} ref={chromeRef} onClick={handleChromeClick}>
            <ActionIcon
              className={styles.viewerClose}
              icon={X}
              title={t('image.close')}
              onClick={handleClose}
            />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
