'use client';

import { use } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { FrameContext } from '../context';
import { markerColor, styles } from '../style';
import type { VideoCaptionProps } from '../type';
import { useVideo } from '../useVideo';

const Caption = ({ action, className, style }: VideoCaptionProps) => {
  const frame = use(FrameContext);
  const markers = useVideo((state) => (state.captions ? state.activeMarkers : undefined));
  if (!markers || markers.length === 0) return null;
  const raised = Boolean(frame?.overlay && frame.visible);

  return (
    <div
      data-raised={String(raised)}
      data-video-caption=""
      {...styleProps([styles.caption, raised && styles.captionRaised], className, style)}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {markers.map((marker, index) => (
        <div key={marker.key ?? `${marker.time}-${index}`} {...styleProps(styles.captionItem)}>
          {(marker.label !== undefined || action) && (
            <div {...styleProps(styles.captionTitle)}>
              <span
                {...styleProps(styles.dot, undefined, { background: markerColor(marker.color) })}
              />
              {marker.label}
              {action?.(marker)}
            </div>
          )}
          <div>{marker.content}</div>
        </div>
      ))}
    </div>
  );
};

Caption.displayName = 'VideoCaption';

export default Caption;
