import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  root: {
    'overflow': 'hidden',
    'transition': 'all 0.2s ease-in-out',
    'color': { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    'cursor': 'pointer',
    'fontWeight': 'bold',
    '::before': {
      transition: 'all 0.2s ease-in-out',
      backgroundImage: `linear-gradient(to right, transparent, ${cssVar.gold}, transparent)`,
      content: "''",
      display: 'block',
      insetBlockEnd: 0,
      opacity: { 'default': 0, ':hover': 1 },
      position: 'absolute',
      height: 1,
      width: '50%',
    },
  },
});
