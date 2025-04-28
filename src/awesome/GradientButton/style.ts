import type { ButtonProps } from 'antd';
import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  ({ isDarkMode, cx, css, token, stylish }, size: ButtonProps['size']) => {
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
        border: none;
        border-radius: ${radius}px !important;

        &::before {
          ${stylish.gradientAnimation}
          content: '';

          position: absolute;
          z-index: -2;
          inset: 0;

          border-radius: ${radius}px;
        }

        &::after {
          content: '';

          position: absolute;
          z-index: -1;
          inset-block-start: 1px;
          inset-inline-start: 1px;

          width: calc(100% - 2px);
          height: calc(100% - 2px);

          background: ${isDarkMode ? token.colorBgLayout : token.colorBgContainer};
          border-radius: ${radius - 1}px;
        }

        &:hover {
          &::after {
            background: ${rgba(
              isDarkMode ? token.colorBgLayout : token.colorBgContainer,
              isDarkMode ? 0.9 : 0.95,
            )};
          }
        }

        &:active {
          &::after {
            background: ${rgba(
              isDarkMode ? token.colorBgLayout : token.colorBgContainer,
              isDarkMode ? 0.85 : 0.9,
            )};
          }
        }
      `,
      glow: cx(
        stylish.gradientAnimation,
        css`
          position: absolute;
          z-index: -2;
          inset-block-start: 0;
          inset-inline-start: 0;

          width: 100%;
          height: 100%;

          opacity: 0.5;
          filter: blur(0.5em);
          border-radius: inherit;
        `,
      ),
    };
  },
);
