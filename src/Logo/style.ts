import { createStyles } from 'antd-style';

export const LOGO_3D = 'https://npm.elemecdn.com/@lobehub/assets-logo/assets/logo-3d.webp';
export const LOGO_FLAT = 'https://npm.elemecdn.com/@lobehub/assets-logo/assets/logo-flat.svg';

export const useStyles = createStyles(({ css }) => {
  return {
    extraTitle: css`
      font-weight: 300;
      white-space: nowrap;
    `,
    flexCenter: css`
      display: flex;
      align-items: center;
    `,
  };
});
