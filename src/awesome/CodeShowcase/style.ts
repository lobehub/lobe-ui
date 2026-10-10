import * as stylex from '@stylexjs/stylex';
import type { CSSProperties } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  panes: {
    gap: 12,
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      [media.mobile]: '1fr',
    },
  },
  preview: {
    padding: 20,
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgElevated} 25%, transparent)`,
    boxShadow: cssVar.boxShadowTertiary,
    display: 'flex',
    justifyContent: 'center',
    minBlockSize: 'var(--code-showcase-min-height)',
    minInlineSize: 0,
  },
  root: {
    gap: 20,
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
});

export const childStyles = {
  code: {
    minBlockSize: 'var(--code-showcase-min-height)',
    minInlineSize: 0,
    overflow: 'auto',
  },
  tabs: {
    alignSelf: 'center',
    maxInlineSize: '100%',
  },
} satisfies Record<string, CSSProperties>;
