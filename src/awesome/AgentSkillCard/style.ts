import * as stylex from '@stylexjs/stylex';
import type { CSSProperties } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  agent: {
    borderRadius: 8,
    flex: 'none',
    transition: 'transform 140ms ease',
    display: 'inline-flex',
    transform: {
      'default': null,
      ':hover': 'translateY(-2px)',
      '@media (prefers-reduced-motion: reduce)': { 'default': null, ':hover': 'none' },
    },
  },
  agents: {
    gap: 14,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  description: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 1.5,
    textAlign: 'center',
    textWrap: 'balance',
  },
  footer: {
    gap: 16,
    color: cssVar.colorTextTertiary,
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: cssVar.fontSizeSM,
    justifyContent: 'center',
  },
  panel: {
    gap: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 20,
    paddingInline: 12,
    backdropFilter: 'blur(12px)',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgElevated} 25%, transparent)`,
    boxShadow: '0 1px 2px rgb(0 0 0 / 4%), 0 12px 32px rgb(0 0 0 / 6%)',
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    maxInlineSize: 480,
    paddingBlockEnd: '16px',
    paddingBlockStart: '12px',
  },
});

export const childStyles = {
  code: {
    inlineSize: '100%',
    textAlign: 'start',
  },
} satisfies Record<string, CSSProperties>;
