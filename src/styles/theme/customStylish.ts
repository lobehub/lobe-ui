import { type GetCustomStylish, keyframes } from 'antd-style';

import type { LobeCustomStylish } from '@/types/customStylish';

export const generateCustomStylish: GetCustomStylish<LobeCustomStylish> = ({
  css,
  token,
  isDarkMode,
}) => {
  const gradient = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `;

  return {
    active: css`
      color: ${token.colorText};
      background: ${token.colorFillSecondary};

      &:hover {
        color: ${token.colorText};
        background: ${token.colorFill};
      }
    `,
    blur: css`
      backdrop-filter: saturate(150%) blur(10px);
    `,
    blurStrong: css`
      backdrop-filter: saturate(150%) blur(36px);
    `,
    bottomScrollbar: css`
      ::-webkit-scrollbar {
        width: 0;
        height: 4px;
        background-color: transparent;

        &-thumb {
          border-radius: 4px;
          background-color: ${token.colorFill};
          transition: background-color 500ms ${token.motionEaseOut};
        }

        &-corner {
          display: none;
          width: 0;
          height: 0;
        }
      }
    `,
    disabled: css`
      cursor: not-allowed;
      opacity: 0.5;
    `,
    gradientAnimation: css`
      border-radius: inherit;
      background-image: linear-gradient(
        -45deg,
        ${token.gold},
        ${token.magenta},
        ${token.geekblue},
        ${token.cyan}
      );
      background-size: 400% 400%;
      animation: 5s ${gradient} 5s ease infinite;
    `,
    noScrollbar: css`
      ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        background-color: transparent;
      }
    `,
    resetLinkColor: css`
      cursor: pointer;
      color: ${token.colorTextSecondary};

      &:hover {
        color: ${token.colorText};
      }
    `,
    shadow: css`
      box-shadow:
        0 1px 0 -1px ${isDarkMode ? token.colorBgLayout : token.colorBorder},
        0 1px 2px -0.5px ${isDarkMode ? token.colorBgLayout : token.colorBorder},
        0 2px 2px -1px ${isDarkMode ? token.colorBgLayout : token.colorBorderSecondary},
        0 3px 6px -4px ${isDarkMode ? token.colorBgLayout : token.colorBorderSecondary};
    `,
    variantBorderless: css`
      border: none;
      background: none;
      box-shadow: none;

      &:hover {
        background: ${token.colorFillTertiary};
      }
    `,
    variantBorderlessDanger: css`
      border: none;
      background: none;
      box-shadow: none;

      &:hover {
        background: ${token.colorErrorFillTertiary};
        box-shadow: inset 0 0 0 1px ${token.colorErrorFillTertiary};
      }
    `,
    variantBorderlessWithoutHover: css`
      border: none;
      background: none;
      box-shadow: none;
    `,
    variantFilled: css`
      background: ${token.colorFillTertiary};

      &:hover {
        background: ${token.colorFillSecondary};
      }
    `,
    variantFilledDanger: css`
      background: ${token.colorErrorFillTertiary};

      &:hover {
        background: ${token.colorErrorFillSecondary};
      }
    `,
    variantFilledWithoutHover: css`
      background: ${token.colorFillTertiary};
    `,
    variantOutlined: css`
      border: 1px solid ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};

      &:hover {
        border: 1px solid ${token.colorBorder};
        background: ${token.colorBgContainer};
      }
    `,

    variantOutlinedDanger: css`
      border: 1px solid ${token.colorErrorBorder};

      &:hover {
        border: 1px solid ${token.colorErrorBorder};
      }
    `,
    variantOutlinedWithoutHover: css`
      border: 1px solid ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};
    `,
  };
};
