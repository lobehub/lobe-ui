import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  container: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap',
  },
  cursor: {
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: cssVar.colorPrimary,
    display: 'inline-block',
    marginInlineStart: '0.25rem',
    opacity: 1,
    transform: 'translateY(10%)',
    height: '1em',
    width: 3,
  },
  cursorBlock: {
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: cssVar.colorPrimary,
    display: 'inline-block',
    marginInlineStart: '0.25rem',
    opacity: 1,
    transform: 'translateY(10%)',
    height: '1em',
    width: '0.5em',
  },
  cursorCustom: {
    alignItems: 'center',
    display: 'inline-block',
    marginInlineStart: '0.25rem',
    opacity: 1,
  },
  cursorDot: {
    borderRadius: '50%',
    alignItems: 'center',
    backgroundColor: cssVar.colorPrimary,
    display: 'inline-block',
    marginInlineStart: '0.25rem',
    opacity: 1,
    height: '0.75em',
    width: '0.75em',
  },
  cursorUnderscore: {
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: cssVar.colorPrimary,
    display: 'inline-block',
    marginInlineStart: '0.25rem',
    opacity: 1,
    transform: 'translateY(0.3em)',
    height: '0.15em',
    width: '0.6em',
  },
  text: {
    color: cssVar.colorText,
  },
});
