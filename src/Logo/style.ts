import { createStyles } from 'antd-style';

import { genCdnUrl } from '@/utils/genCdnUrl';

export const LOGO_3D = genCdnUrl({
  path: 'assets/logo-3d.webp',
  pkg: '@lobehub/assets-logo',
  version: '1.1.0',
});
export const LOGO_FLAT = genCdnUrl({
  path: 'assets/logo-flat.svg',
  pkg: '@lobehub/assets-logo',
  version: '1.1.0',
});

export const useStyles = createStyles(({ css }) => {
  return {
    extraTitle: css`
      font-weight: 300;
      white-space: nowrap;
    `,
  };
});
