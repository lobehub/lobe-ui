'use client';

import { Dialog, type DialogRootProps } from '@base-ui/react/dialog';
import {
  memo,
  type SyntheticEvent,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMergeRefs } from 'react-merge-refs';

import { ToastHost } from '@/base-ui/Toast';
import { useLayerZIndex } from '@/base-ui/zIndex';
import { MotionComponent } from '@/MotionProvider';
import { useAppElement } from '@/ThemeProvider';

import { styles } from '../style';
import { computeFit, type Size } from './geometry';
import { beginClosePreview, endClosePreview, type PreviewEntry } from './registry';
import { useFlipTransition } from './useFlipTransition';
import { readNatural, useGalleryNav } from './useGalleryNav';
import { useViewerGestures } from './useViewerGestures';
import { useZoomPan } from './useZoomPan';
import ViewerChrome from './ViewerChrome';

export interface ImageViewerProps {
  entries: PreviewEntry[];
  index: number;
  token: number;
}

const readViewport = (): Size => ({ height: window.innerHeight, width: window.innerWidth });

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const ImageViewer = memo<ImageViewerProps>(({ entries, index, token }) => {
  const openerEntry = entries[index];
  const appElement = useAppElement();
  const motionComponent = use(MotionComponent);
  const [animated] = useState(() => !!motionComponent && !prefersReducedMotion());

  const { ref: layerRef, zIndex } = useLayerZIndex<HTMLDivElement>('modal');

  const [currentIndex, setCurrentIndex] = useState(index);
  const currentEntry = entries[currentIndex];
  const currentEntryRef = useRef(currentEntry);
  currentEntryRef.current = currentEntry;

  const [source, setSource] = useState(openerEntry.src);
  const [natural, setNatural] = useState<Size>(() => readNatural(openerEntry.element));
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
    maxScale: currentEntry.options.maxScale,
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

  const getCloseSource = useCallback(() => currentEntryRef.current.element, []);

  const transform = useMemo(
    () => ({ flipX, flipY, rotate, scale, x, y }),
    [flipX, flipY, rotate, scale, x, y],
  );

  const handleClosed = useCallback(() => endClosePreview(token), [token]);

  const {
    backdropRef,
    chromeRef,
    close,
    imageRef: flipImageRef,
    switchTo,
  } = useFlipTransition({
    animated,
    getCloseSource,
    getFitRect,
    onClosed: handleClosed,
    source: openerEntry.element,
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

  const { hasNext, hasPrev, next, prev } = useGalleryNav({
    currentIndex,
    entries,
    flipX,
    flipY,
    rotate,
    scale,
    setCurrentIndex,
    setNatural,
    setSource,
    switchTo,
    syncZoomNatural,
    x,
    y,
  });

  const gestures = useViewerGestures({
    dragBy,
    dragEnd,
    handleDoubleClick,
    handleWheel,
    isClean,
    isZoomed,
    onClose: handleClose,
    onNext: next,
    onPrev: prev,
    reset,
    zoomIn,
    zoomOut,
  });

  const popupRef = useMergeRefs<HTMLDivElement>([layerRef, gestures.popupRef]);
  const imageRef = useMergeRefs<HTMLImageElement>([flipImageRef, gestures.imageRef]);

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
    const { previewSrc, src } = currentEntry;
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
  }, [currentEntry]);

  useEffect(
    () => () => {
      const thumbnailWasRemoved = !openerEntry.element.isConnected;
      if (thumbnailWasRemoved) endClosePreview(token);
    },
    [openerEntry, token],
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
          aria-label={currentEntry.element.alt || undefined}
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
            alt={currentEntry.element.alt}
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
          <ViewerChrome
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            chromeRef={chromeRef}
            current={currentIndex}
            fitRect={fitRect}
            flipHorizontal={flipHorizontal}
            flipVertical={flipVertical}
            hasNext={hasNext}
            hasPrev={hasPrev}
            natural={natural}
            next={next}
            prev={prev}
            reset={reset}
            rotateLeft={rotateLeft}
            rotateRight={rotateRight}
            rotation={rotation}
            scale={scale}
            source={source}
            toolbarAddon={currentEntry.options.toolbarAddon}
            total={entries.length}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            onClose={handleClose}
          />
        </Dialog.Popup>
        <ToastHost root={appElement ?? undefined} />
      </Dialog.Portal>
    </Dialog.Root>
  );
});

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
