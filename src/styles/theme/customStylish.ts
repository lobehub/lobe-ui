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
        inset 0 0 0 1px ${token.colorFillQuaternary},
        ${token.boxShadowTertiary};

      &:hover {
        box-shadow:
          inset 0 0 0 1px ${token.colorFillTertiary},
          ${token.boxShadowTertiary};
      }

      &:active {
        box-shadow:
          inset 0 0 0 1px ${isDarkMode ? token.colorFillQuaternary : token.colorFillSecondary},
          ${token.boxShadowTertiary};
      }
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
      box-shadow: inset 0 0 0 1px ${token.colorFillQuaternary};

      &:hover {
        background: ${token.colorFillSecondary};
        box-shadow: inset 0 0 0 1px ${token.colorFillTertiary};
      }

      &:active {
        background: ${isDarkMode ? token.colorFillTertiary : token.colorFill};
        box-shadow: inset 0 0 0 1px
          ${isDarkMode ? token.colorFillQuaternary : token.colorFillSecondary};
      }
    `,
    variantFilledDanger: css`
      background: ${token.colorErrorFillTertiary};
      box-shadow: inset 0 0 0 1px ${token.colorErrorFillQuaternary};

      &:hover {
        background: ${token.colorErrorFillSecondary};
        box-shadow: inset 0 0 0 1px ${token.colorErrorFillTertiary};
      }

      &:active {
        background: ${isDarkMode ? token.colorErrorFillTertiary : token.colorErrorFill};
        box-shadow: inset 0 0 0 1px
          ${isDarkMode ? token.colorErrorFillQuaternary : token.colorErrorFillSecondary};
      }
    `,
    variantFilledWithoutHover: css`
      background: ${token.colorFillTertiary};
      box-shadow: inset 0 0 0 1px ${token.colorFillQuaternary};
    `,
    variantOutlined: css`
      box-shadow: inset 0 0 0 1px ${token.colorFillQuaternary};

      &:hover {
        box-shadow: inset 0 0 0 1px ${token.colorFillTertiary};
      }

      &:active {
        background: ${token.colorFillTertiary};
        box-shadow: inset 0 0 0 1px
          ${isDarkMode ? token.colorFillQuaternary : token.colorFillSecondary};
      }
    `,
    variantOutlinedDanger: css`
      box-shadow: inset 0 0 0 1px ${token.colorErrorFillQuaternary};

      &:hover {
        box-shadow: inset 0 0 0 1px ${token.colorErrorFillTertiary};
      }

      &:active {
        background: ${token.colorErrorFillTertiary};
        box-shadow: inset 0 0 0 1px
          ${isDarkMode ? token.colorErrorFillQuaternary : token.colorErrorFillSecondary};
      }
    `,
    variantOutlinedWithoutHover: css`
      box-shadow: inset 0 0 0 1px ${token.colorFillQuaternary};
    `,
  };
};
