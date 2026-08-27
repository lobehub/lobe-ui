'use client';

import { memo, type Ref, useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_AUTO_ZOOM_THRESHOLD, DEFAULT_MAX_SCALE } from '@/Image/viewer/geometry';
import PreviewOutlet from '@/Image/viewer/PreviewOutlet';
import { openPreview } from '@/Image/viewer/registry';

import { toStandaloneSvgString } from './prepareInlineSvg';
import { prepareMermaidSvgString } from './prepareMermaidSvg';

interface MermaidSvgProps {
  className?: string;
  ref?: Ref<HTMLDivElement>;
  style?: React.CSSProperties;
  svg: string;
}

// The viewer flies the image out of the element it was opened from, so the
// diagram needs a real <img> to measure — hence a hidden anchor tracking the
// diagram box rather than a display:none preview image.
const anchorStyle: React.CSSProperties = {
  height: '100%',
  insetBlockStart: 0,
  insetInlineStart: 0,
  pointerEvents: 'none',
  position: 'absolute',
  visibility: 'hidden',
  width: '100%',
};

const MermaidSvg = memo<MermaidSvgProps>(({ className, ref, style, svg }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLImageElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // The preview copy is only built on demand: it has to bake in the resolved
  // CSS variables and be XML-well-formed, neither of which the inline copy needs.
  const handleOpen = useCallback(() => {
    const element = containerRef.current?.querySelector('svg');
    const anchor = anchorRef.current;
    if (!element || !anchor) return;

    const standalone = prepareMermaidSvgString(toStandaloneSvgString(element));
    const url = URL.createObjectURL(new Blob([standalone], { type: 'image/svg+xml' }));
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });

    openPreview({
      element: anchor,
      options: {
        autoZoomThreshold: DEFAULT_AUTO_ZOOM_THRESHOLD,
        defaultZoom: 'auto',
        maxScale: DEFAULT_MAX_SCALE,
      },
      src: url,
    });
  }, []);

  return (
    <div className={className} ref={ref} style={{ position: 'relative', ...style }}>
      <div
        dangerouslySetInnerHTML={{ __html: svg }}
        ref={containerRef}
        style={{ cursor: 'zoom-in' }}
        onClick={handleOpen}
      />
      <img aria-hidden alt="" ref={anchorRef} src={previewUrl} style={anchorStyle} />
      <PreviewOutlet elementRef={anchorRef} />
    </div>
  );
});

MermaidSvg.displayName = 'MermaidSvg';

export default MermaidSvg;
