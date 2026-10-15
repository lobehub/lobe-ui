import * as stylex from '@stylexjs/stylex';
import type { CSSProperties } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  cell: {
    overflow: 'hidden',
  },
  container: {
    padding: 24,
    overflow: 'hidden',
    transition: `all ${cssVar.motionDurationSlow} ${cssVar.motionEaseInOutCirc}`,
    position: 'relative',
    zIndex: 1,
    height: 228,
    maxHeight: 228,
  },
  imgContainer: {
    padding: 4,
    borderRadius: cssVar.borderRadius,
    fontSize: 22,
    opacity: 0.8,
    height: 24,
    width: 24,
  },
  link: {
    transition: `all ${cssVar.motionDurationSlow} ${cssVar.motionEaseInOutCirc}`,
    marginBlockStart: 24,
  },
  title: {
    marginBlock: 16,
    marginInline: 0,
    color: cssVar.colorText,
    fontSize: 20,
    lineHeight: cssVar.lineHeightHeading3,
    pointerEvents: 'none',
  },
});

export const childStyles = {
  desc: {
    color: cssVar.colorTextSecondary,
    pointerEvents: 'none',
  },
  img: {
    color: cssVar.colorText,
    fontSize: 20 * (22 / 24),
    height: 20,
    width: 20,
  },
} satisfies Record<string, CSSProperties>;
