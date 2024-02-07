import type { ButtonProps } from 'antd';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token, isDarkMode, stylish }, size: ButtonProps['size']) => {
    let radius: number;
    switch (size) {
      case 'large': {
        radius = token.borderRadiusLG;
        break;
      }
      case 'middle': {
        radius = token.borderRadius;
        break;
      }
      case 'small': {
        radius = token.borderRadiusSM;
        break;
      }
      default: {
        radius = token.borderRadius;
        break;
      }
    }

    return {
      button: css`
        position: relative;
        z-index: 1;
        ${stylish.gradientAnimation}
        border: none;
        border-radius: ${radius}px !important;

        &::before {
          content: '';

          position: absolute;
          z-index: -1;
          inset-block-start: 1px;
          inset-inline-start: 1px;

          width: calc(100% - 2px);
          height: calc(100% - 2px);

          background: ${token.colorBgLayout};
          border-radius: ${radius - 1}px;
        }
      `,
      glow: css`
        ${stylish.gradientAnimation}
        position: absolute;
        z-index: -2;
        inset-block-start: 0;
        inset-inline-start: 0;

        width: 100%;
        height: 100%;

        opacity: ${isDarkMode ? 0.5 : 0.3};
        filter: blur(${isDarkMode ? 1.5 : 1}em);
        border-radius: inherit;
      `,
    };
  },
);
