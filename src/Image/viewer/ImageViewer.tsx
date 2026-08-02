'use client';

import { Dialog, type DialogRootProps } from '@base-ui/react/dialog';
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
import { useMergeRefs } from 'react-merge-refs';

import ActionIcon from '@/ActionIcon';
import { ToastHost } from '@/base-ui/Toast';
import { useLayerZIndex } from '@/base-ui/zIndex';
import imageMessages from '@/i18n/resources/en/image';
import { useTranslation } from '@/i18n/useTranslation';
import { MotionComponent } from '@/MotionProvider';
import { useAppElement } from '@/ThemeProvider';

import { styles } from '../style';
import { computeFit, type Size } from './geometry';
import { beginClosePreview, endClosePreview, type PreviewEntry } from './registry';
import Toolbar from './Toolbar';
import { useFlipTransition } from './useFlipTransition';
import { useViewerGestures } from './useViewerGestures';
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

  const closeRef = useRef<(() => void) | null>(null);
  const requestClose = useCallback(() => closeRef.current?.(), []);

  const {
    canZoomIn,
    canZoomOut,
    dragBy,
    dragEnd,
    escIntent,
    flipHorizontal,
    flipVertical,
    flipX,
    flipY,
    handleDoubleClick,
    handleWheel,
    isClean,
    isZoomed,
    reset,
    rotate,
    rotateLeft,
    rotateRight,
    rotation,
    scale,
    setNatural: syncZoomNatural,
    setViewport: syncZoomViewport,
    x,
    y,
    zoomIn,
    zoomOut,
  } = useZoomPan({
    maxScale: options.maxScale,
    natural,
    onCloseRequest: requestClose,
    viewport,
  });

  const fitRect = useMemo(
    () => computeFit(natural, viewport, rotation),
    [natural, viewport, rotation],
  );
  const fitRectRef = useRef(fitRect);
  fitRectRef.current = fitRect;
  const getFitRect = useCallback(() => fitRectRef.current, []);

  const transform = useMemo(
    () => ({ flipX, flipY, rotate, scale, x, y }),
    [flipX, flipY, rotate, scale, x, y],
  );

  const handleClosed = useCallback(() => {
    endClosePreview(token);
  }, [token]);

  const {
    backdropRef,
    chromeRef,
    close,
    imageRef: flipImageRef,
  } = useFlipTransition({
    animated,
    getFitRect,
    onClosed: handleClosed,
    source: element,
    transform,
  });

  const isCleanRef = useRef(isClean);
  isCleanRef.current = isClean;

  const handleClose = useCallback(() => {
    beginClosePreview(token);
    close({ fade: !isCleanRef.current });
  }, [close, token]);
  closeRef.current = handleClose;

  const handleDialogOpenChange = useCallback<NonNullable<DialogRootProps['onOpenChange']>>(
    (open, eventDetails) => {
      if (open) return;
      if (eventDetails.reason === 'escape-key' && escIntent() === 'reset') {
        eventDetails.cancel();
        reset();
        return;
      }
      handleClose();
    },
    [escIntent, handleClose, reset],
  );

  const gestures = useViewerGestures({
    dragBy,
    dragEnd,
    handleDoubleClick,
    handleWheel,
    isClean,
    isZoomed,
    onClose: handleClose,
    reset,
    zoomIn,
    zoomOut,
  });

  const popupRef = useMergeRefs<HTMLDivElement>([layerRef, gestures.popupRef]);
  const imageRef = useMergeRefs<HTMLImageElement>([flipImageRef, gestures.imageRef]);

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
          onClick={gestures.onSurfaceClick}
        />
        <Dialog.Popup
          aria-label={element.alt || undefined}
          className={styles.viewerPopup}
          ref={popupRef}
          style={zIndex === undefined ? undefined : { zIndex: zIndex + 1 }}
          onClick={gestures.onSurfaceClick}
          onPointerCancel={gestures.onPointerFinish}
          onPointerDown={gestures.onPointerDown}
          onPointerMove={gestures.onPointerMove}
          onPointerUp={gestures.onPointerFinish}
        >
          <img
            alt={element.alt}
            className={styles.viewerImage}
            ref={imageRef}
            src={source}
            style={{
              cursor: gestures.cursor,
              height: fitRect.height,
              left: fitRect.x,
              top: fitRect.y,
              width: fitRect.width,
            }}
            onClick={gestures.onImageClick}
            onDoubleClick={gestures.onImageDoubleClick}
            onLoad={handleLoad}
          />
          <div className={styles.viewerChrome} ref={chromeRef} onClick={handleChromeClick}>
            <ActionIcon
              className={styles.viewerClose}
              icon={X}
              title={t('image.close')}
              onClick={handleClose}
            />
            <Toolbar
              canZoomIn={canZoomIn}
              canZoomOut={canZoomOut}
              fitRect={fitRect}
              flipHorizontal={flipHorizontal}
              flipVertical={flipVertical}
              natural={natural}
              reset={reset}
              rotateLeft={rotateLeft}
              rotateRight={rotateRight}
              rotation={rotation}
              scale={scale}
              source={source}
              toolbarAddon={options.toolbarAddon}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
            />
          </div>
        </Dialog.Popup>
        <ToastHost root={appElement ?? undefined} />
      </Dialog.Portal>
    </Dialog.Root>
  );
});

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
