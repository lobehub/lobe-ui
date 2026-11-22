import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

/**
 * A watermark: every part is a gray close to the page. The eye white is lighter than the body
 * and the pupil darker in both themes, so the face reads the same way on light and dark.
 */
export const styles = stylex.create({
  dark: {
    '--lobe-lobot-loading-pupil': cssVar.gray2,
    '--lobe-lobot-loading-sclera': cssVar.gray6,
  },
  pupil: {
    fill: 'var(--lobe-lobot-loading-pupil)',
  },
  root: {
    '--lobe-lobot-loading-color': cssVar.gray4,
    '--lobe-lobot-loading-pupil': cssVar.gray6,
    '--lobe-lobot-loading-sclera': cssVar.gray1,
    'fill': 'var(--lobe-lobot-loading-color)',
    'flex': 'none',
    'lineHeight': 1,
  },
  sclera: {
    fill: 'var(--lobe-lobot-loading-sclera)',
  },
  smile: {
    fill: 'none',
    stroke: 'var(--lobe-lobot-loading-sclera)',
    strokeLinecap: 'round',
  },
});
