import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { videoMarker } from './marker.stylex';

export const maskHoverCls = 'lobe-video-mask';

export const styles = stylex.create({
  filled: {
    borderColor: cssVar.colorBorderSecondary,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorFillTertiary,
  },
  mask: {
    inset: 0,
    transition: 'opacity 0.2s ease',
    backgroundColor: cssVar.colorBgMask,
    opacity: { default: 0, [stylex.when.ancestor(':hover', videoMarker)]: 1 },
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
  root: {
    borderRadius: cssVar.borderRadius,
    overflow: 'hidden',
    backgroundColor: cssVar.colorFillTertiary,
    marginBlockEnd: '1em',
    marginBlockStart: 0,
    position: 'relative',
    height: 'auto',
    maxHeight: 'var(--video-max-height, 100%)',
    maxWidth: 'var(--video-max-width, 100%)',
    minHeight: 'var(--video-min-height, unset)',
    minWidth: 'var(--video-min-width, unset)',
    width: '100%',
  },
  video: {
    cursor: 'pointer',
    width: '100%',
  },
});
