import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const LOGO_3D = {
  path: 'assets/logo-3d.webp',
  pkg: '@lobehub/assets-logo',
  version: '1.2.0',
};

export const styles = stylex.create({
  divider: {
    color: cssVar.colorFill,
  },
  extraTitle: {
    fontWeight: 300,
    whiteSpace: 'nowrap',
  },
});
