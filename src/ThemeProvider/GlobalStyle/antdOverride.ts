import { Theme, css } from 'antd-style';
import { readableColor, rgba } from 'polished';

export default (token: Theme) => {
  const readColor = readableColor(token.colorPrimary);
  return css`
    .${token.prefixCls}-checkbox-inner:after {
      border-color: ${readableColor(token.colorPrimary)} !important;
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

    .${token.prefixCls}-tooltip-inner {
      display: flex;
      align-items: center;
      justify-content: center;

      min-height: unset;
      padding-block: 4px;
      padding-inline: 8px;
      border-radius: ${token.borderRadiusSM}px !important;

      color: ${token.colorBgLayout} !important;

      background-color: ${token.colorText} !important;
    }

    .${token.prefixCls}-tooltip-arrow {
      &::before,
      &::after {
        background: ${token.colorText} !important;
      }
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

    .${token.prefixCls}-popover-inner,
      .${token.prefixCls}-dropdown-menu,
      .${token.prefixCls}-select-dropdown {
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
