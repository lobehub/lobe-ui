import { GetCustomStylish, keyframes } from 'antd-style';

import { LobeCustomStylish } from '@/types/customStylish';

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

      &:active {
        color: ${token.colorText};
        background: ${isDarkMode ? token.colorFillSecondary : token.colorFill};
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
          background-color: ${token.colorFill};
          border-radius: 4px;
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
      background-image: linear-gradient(
        -45deg,
        ${token.gold},
        ${token.magenta},
        ${token.geekblue},
        ${token.cyan}
      );
      background-size: 400% 400%;
      border-radius: inherit;
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
      background: none;
      border: none;
      box-shadow: none;

      &:hover {
        background: ${token.colorFillTertiary};
      }

      &:active {
        background: ${isDarkMode ? token.colorFillQuaternary : token.colorFillSecondary};
      }
    `,
    variantBorderlessDanger: css`
      background: none;
      border: none;
      box-shadow: none;

      &:hover {
        background: ${token.colorErrorFillTertiary};
        box-shadow: inset 0 0 0 1px ${token.colorErrorFillTertiary};
      }

      &:active {
        background: ${isDarkMode ? token.colorErrorFillQuaternary : token.colorErrorFillSecondary};
        box-shadow: inset 0 0 0 1px
          ${isDarkMode ? token.colorErrorFillQuaternary : token.colorErrorFillSecondary};
      }
    `,
    variantBorderlessWithoutHover: css`
      background: none;
      border: none;
      box-shadow: none;
    `,
    variantFilled: css`
      background: ${token.colorFillTertiary};

      &:hover {
        background: ${token.colorFillSecondary};
      }

      &:active {
        background: ${isDarkMode ? token.colorFillTertiary : token.colorFill};
      }
    `,
    variantFilledDanger: css`
      background: ${token.colorErrorFillTertiary};

      &:hover {
        background: ${token.colorErrorFillSecondary};
      }

      &:active {
        background: ${isDarkMode ? token.colorErrorFillTertiary : token.colorErrorFill};
      }
    `,
    variantFilledWithoutHover: css`
      background: ${token.colorFillTertiary};
    `,
    variantOutlined: css`
      background: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorderSecondary};

      &:hover {
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
      }

      &:active {
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
      }
    `,

    variantOutlinedDanger: css`
      border: 1px solid ${token.colorErrorBorder};

      &:hover {
        border: 1px solid ${token.colorErrorBorder};
      }

      &:active {
        border: 1px solid ${token.colorErrorBorder};
      }
    `,
    variantOutlinedWithoutHover: css`
      background: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorderSecondary};
    `,
  };
};
