import { createStaticStyles, keyframes } from 'antd-style';

import type { LobeCustomStylish } from '@/types/customStylish';

/**
 * Static version of custom stylish utilities.
 * This can be used with createStaticStyles for better performance.
 *
 * Note: Some styles that depend on isDarkMode or custom tokens may have limitations.
 * For full dynamic support, use the regular customStylish from './customStylish'.
 */
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

export const staticStylish = createStaticStyles(({ css, cssVar }) => ({
  active: css`
    color: ${cssVar.colorText};
    background: ${cssVar.colorFillSecondary};

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFill};
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
        background-color: ${cssVar.colorFill};
        transition: background-color 500ms ${cssVar.motionEaseOut};
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
      ${cssVar.gold},
      ${cssVar.magenta},
      ${cssVar.geekblue},
      ${cssVar.cyan}
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
    color: ${cssVar.colorTextSecondary};

    &:hover {
      color: ${cssVar.colorText};
    }
  `,

  /**
   * Shadow style using CSS variables.
   * Note: This uses CSS variables which automatically adapt to light/dark mode.
   * For more control, use the dynamic version from customStylish.
   */
  shadow: css`
    box-shadow:
      0 1px 0 -1px ${cssVar.colorBorder},
      0 1px 2px -0.5px ${cssVar.colorBorder},
      0 2px 2px -1px ${cssVar.colorBorderSecondary},
      0 3px 6px -4px ${cssVar.colorBorderSecondary};
  `,

  variantBorderless: css`
    border: none;
    background: none;
    box-shadow: none;

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }
  `,

  /**
   * Variant borderless danger style.
   * Note: Uses colorErrorBg as fallback since colorErrorFillTertiary is not in cssVar.
   * For exact match, use the dynamic version from customStylish.
   */
  variantBorderlessDanger: css`
    border: none;
    background: none;
    box-shadow: none;

    &:hover {
      background: ${cssVar.colorErrorBg};
      box-shadow: inset 0 0 0 1px ${cssVar.colorErrorBg};
    }
  `,

  variantBorderlessWithoutHover: css`
    border: none;
    background: none;
    box-shadow: none;
  `,

  variantFilled: css`
    background: ${cssVar.colorFillTertiary};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,

  /**
   * Variant filled danger style.
   * Note: Uses colorErrorBg as fallback since colorErrorFillTertiary/Secondary are not in cssVar.
   * For exact match, use the dynamic version from customStylish.
   */
  variantFilledDanger: css`
    background: ${cssVar.colorErrorBg};

    &:hover {
      background: ${cssVar.colorErrorBgHover};
    }
  `,

  variantFilledWithoutHover: css`
    background: ${cssVar.colorFillTertiary};
  `,

  variantOutlined: css`
    border: 1px solid ${cssVar.colorBorderSecondary};
    background: ${cssVar.colorBgContainer};

    &:hover {
      border: 1px solid ${cssVar.colorBorder};
      background: ${cssVar.colorBgContainer};
    }
  `,

  variantOutlinedDanger: css`
    border: 1px solid ${cssVar.colorErrorBorder};

    &:hover {
      border: 1px solid ${cssVar.colorErrorBorder};
    }
  `,

  variantOutlinedWithoutHover: css`
    border: 1px solid ${cssVar.colorBorderSecondary};
    background: ${cssVar.colorBgContainer};
  `,
})) as LobeCustomStylish;
