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
import { computeFit, type Size, unrotatedRect } from './geometry';
import { beginClosePreview, endClosePreview, type PreviewEntry } from './registry';
import { useFinalFocus } from './useFinalFocus';
import { useFlipTransition } from './useFlipTransition';
import { readNatural, useGalleryNav } from './useGalleryNav';
import { useRefitTransition } from './useRefitTransition';
import { useViewerGestures } from './useViewerGestures';
import { useZoomPan } from './useZoomPan';
import ViewerChrome from './ViewerChrome';

export interface ImageViewerProps {
  entries: PreviewEntry[];
  index: number;
  openerFocusElement: HTMLElement | null;
  token: number;
}

const readViewport = (): Size => ({ height: window.innerHeight, width: window.innerWidth });

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const ImageViewer = memo<ImageViewerProps>(({ entries, index, openerFocusElement, token }) => {
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

  // useZoomPan needs to gate its wheel/toolbar entry points on close-in-flight,
  // but that state only exists once useFlipTransition (below) has run — and it
  // needs useZoomPan's own transform values first. Break the cycle with a
  // stable indirection: the ref is repointed at the real isClosing once it's
  // available, written directly during render like the other *Ref fields here.
  const isClosingIndirectRef = useRef<() => boolean>(() => false);
  const isClosingIndirect = useCallback(() => isClosingIndirectRef.current(), []);

  const fillViewport = Boolean(
    currentEntry.previewSrc && currentEntry.previewSrc !== currentEntry.src,
  );

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
    resetCloseTracking,
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
    fillViewport,
    isClosing: isClosingIndirect,
    maxScale: currentEntry.options.maxScale,
    natural,
    onCloseRequest: requestClose,
    viewport,
  });

  const fitRect = useMemo(
    () => computeFit(natural, viewport, rotation, fillViewport),
    [natural, viewport, rotation, fillViewport],
  );
  const fitRectRef = useRef(fitRect);
  fitRectRef.current = fitRect;
  const getFitRect = useCallback(() => fitRectRef.current, []);

  const imageRect = useMemo(() => unrotatedRect(fitRect, rotation), [fitRect, rotation]);

  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;
  const getViewportWidth = useCallback(() => viewportRef.current.width, []);

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
    isClosing,
    isTransitioning,
    switchTo,
  } = useFlipTransition({
    animated,
    getCloseSource,
    getFitRect,
    getViewportWidth,
    onClosed: handleClosed,
    source: openerEntry.element,
    transform,
  });
  isClosingIndirectRef.current = isClosing;

  useRefitTransition({
    animated,
    fillViewport,
    isTransitioning,
    natural,
    rotation,
    scale,
    viewport,
    x,
    y,
  });
  const finalFocus = useFinalFocus(openerFocusElement);

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
      // Base UI fires this on every Esc regardless of whether we're already
      // mid-close (our Dialog.Root's open prop never actually flips to
      // false), so without this guard a second Esc during the close window
      // reads escIntent() off the close spring's mid-flight scale, decides
      // 'reset', and cancels the close animation out from under itself.
      if (isClosing()) return;
      if (eventDetails.reason === 'escape-key' && escIntent() === 'reset') {
        eventDetails.cancel();
        reset();
        return;
      }
      handleClose();
    },
    [escIntent, handleClose, isClosing, reset],
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

  const { hasNext, hasPrev, next, prev } = useGalleryNav({
    cancelPendingClose: gestures.cancelPendingClose,
    currentIndex,
    entries,
    flipX,
    flipY,
    resetCloseTracking,
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

  const popupNodeRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useMergeRefs<HTMLDivElement>([layerRef, gestures.popupRef, popupNodeRef]);
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
          finalFocus={finalFocus}
          // Focus the popup itself instead of Base UI's default (the first
          // tabbable — the close button): a focus-visible close button pins
          // the idle auto-hide open forever and pops its tooltip on open.
          initialFocus={popupNodeRef}
          ref={popupRef}
          style={zIndex === undefined ? undefined : { zIndex: zIndex + 1 }}
          tabIndex={-1}
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
              height: imageRect.height,
              left: imageRect.x,
              top: imageRect.y,
              width: imageRect.width,
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
