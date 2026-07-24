'use client';

import { Image as AntImage } from 'antd';
import { memo, type Ref, useCallback, useEffect, useRef, useState } from 'react';

import { toStandaloneSvgString } from './prepareInlineSvg';
import { prepareMermaidSvgString } from './prepareMermaidSvg';

interface MermaidSvgProps {
  className?: string;
  ref?: Ref<HTMLDivElement>;
  style?: React.CSSProperties;
  svg: string;
}

const MermaidSvg = memo<MermaidSvgProps>(({ className, ref, style, svg }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // The preview copy is only built on demand: it has to bake in the resolved
  // CSS variables and be XML-well-formed, neither of which the inline copy needs.
  const handleOpen = useCallback(() => {
    const element = containerRef.current?.querySelector('svg');
    if (!element) return;

    const standalone = prepareMermaidSvgString(toStandaloneSvgString(element));
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(new Blob([standalone], { type: 'image/svg+xml' }));
    });
    setOpen(true);
  }, []);

  return (
    <div className={className} ref={ref} style={style}>
      <div
        dangerouslySetInnerHTML={{ __html: svg }}
        ref={containerRef}
        style={{ cursor: 'zoom-in' }}
        onClick={handleOpen}
      />
      {previewUrl && (
        <AntImage
          preview={{ onVisibleChange: setOpen, src: previewUrl, visible: open }}
          src={previewUrl}
          style={{ display: 'none' }}
          wrapperStyle={{ display: 'none' }}
        />
      )}
    </div>
  );
});

MermaidSvg.displayName = 'MermaidSvg';

export default MermaidSvg;
