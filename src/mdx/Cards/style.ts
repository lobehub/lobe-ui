import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { cardMarker } from './marker.stylex';

export const styles = stylex.create({
  card: {
    '--lobe-markdown-header-multiple': '0.2',
    '--lobe-markdown-margin-multiple': 1,
    'overflow': 'hidden',
    'color': cssVar.colorText,
  },
  container: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
  },
  desc: {
    transition: `color 0.2s ${cssVar.motionEaseInOut}`,
    color: {
      default: cssVar.colorTextDescription,
      [stylex.when.ancestor(':hover', cardMarker)]: cssVar.colorTextSecondary,
    },
  },
  icon: {
    marginBlock: '0.1em',
    transition: `opacity 0.2s ${cssVar.motionEaseInOut}`,
    opacity: {
      default: 0.5,
      [stylex.when.ancestor(':hover', cardMarker)]: 1,
    },
  },
});
