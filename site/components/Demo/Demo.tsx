import './Demo.css';

import { type CSSProperties, useId } from 'react';

import type { DemoProps } from '../../types/demo';
import CanonicalPreview from './CanonicalPreview';

type DemoFrameStyle = CSSProperties & { '--demo-frame-height'?: string };

export default function Demo({
  description,
  editable,
  height,
  isolated = false,
  layout = 'default',
  of,
  title,
}: DemoProps) {
  const headingId = useId();
  const resolvedEditable = editable ?? of.editable;
  const style: DemoFrameStyle | undefined =
    height === undefined
      ? undefined
      : { '--demo-frame-height': typeof height === 'number' ? `${height}px` : height };

  return (
    <section
      aria-label={title ? undefined : `Demo: ${of.sourcePath}`}
      aria-labelledby={title ? headingId : undefined}
      className="demo-frame"
      data-demo-editable={resolvedEditable}
      data-demo-isolated={isolated}
      data-demo-layout={layout}
    >
      {title || description ? (
        <header className="demo-frame__header">
          {title ? <h3 id={headingId}>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </header>
      ) : null}
      <div className="demo-frame__preview" style={style}>
        <CanonicalPreview demo={of} />
      </div>
    </section>
  );
}
