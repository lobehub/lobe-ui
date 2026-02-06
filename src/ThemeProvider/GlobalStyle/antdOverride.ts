import { css, type Theme } from 'antd-style';
import { rgba } from 'polished';

import { safeReadableColor } from '@/utils/safeReadableColor';

export default (token: Theme) => {
  const readColor = safeReadableColor(token.colorPrimary);
  return css`
    .${token.prefixCls}-checkbox-inner:after {
      border-color: ${safeReadableColor(token.colorPrimary)} !important;
    }

    .${token.prefixCls}-btn {
      box-shadow: none;
    }

    .${token.prefixCls}-btn-primary:not(:disabled) {
      color: ${readColor} !important;

      &:hover {
        color: ${readColor} !important;
      }

      &:active {
        color: ${readColor} !important;
      }
    }

    .${token.prefixCls}-tooltip {
      --antd-arrow-background-color: ${token.colorBgElevated};

      max-width: 320px;
    }

    .${token.prefixCls}-tooltip-arrow::before {
      background: ${token.colorBgElevated} !important;
    }

    .${token.prefixCls}-tooltip-arrow::after {
      box-shadow: 0 0 0 1px ${token.colorBorderSecondary} !important;
    }

    .${token.prefixCls}-tooltip-container {
      user-select: none;

      display: flex;
      gap: 6px;
      align-items: center;

      min-width: unset;
      min-height: unset;
      padding-block: 4px;
      padding-inline: 8px;
      border: 1px solid ${token.colorBorderSecondary} !important;
      border-radius: ${token.borderRadiusSM}px !important;

      font-size: ${token.fontSizeSM}px;
      line-height: 1.2;
      color: ${token.colorTextSecondary} !important;
      word-break: break-word;
      white-space: normal;

      background: ${token.colorBgElevated} !important;
      box-shadow:
        0 1px 2px 0 rgba(0, 0, 0, 3%),
        0 1px 6px -1px rgba(0, 0, 0, 2%),
        0 2px 4px 0 rgba(0, 0, 0, 2%) !important;
    }

    .${token.prefixCls}-switch-handle::before {
      background: ${token.colorBgContainer} !important;
    }

    .${token.prefixCls}-image-preview-close,
      .${token.prefixCls}-image-preview-switch-right,
      .${token.prefixCls}-image-preview-switch-left {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 32px;
      height: 32px;
      padding: 0;

      background: ${rgba(token.colorBgMask, 0.1)};

      border-radius: ${token.borderRadiusLG}px;

      ${token.stylish.blur};
    }

    .${token.prefixCls}-dropdown-menu, .${token.prefixCls}-select-dropdown {
      border-radius: ${token.borderRadius}px !important;
      box-shadow:
        0 0 15px 0 #00000008,
        0 2px 30px 0 #00000014,
        0 0 0 1px ${token.isDarkMode ? token.colorFillTertiary : token.colorBorder} inset !important;
    }

    .${token.prefixCls}-modal-content {
      border: 1px solid ${token.colorBorderSecondary} !important;
    }

    .${token.prefixCls}-radio-wrapper
      .${token.prefixCls}-radio-checked
      .${token.prefixCls}-radio-inner:after {
      background: ${readColor};
    }
  `;
};
