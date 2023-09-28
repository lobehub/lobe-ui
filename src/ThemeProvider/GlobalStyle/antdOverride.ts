import { Theme, css } from 'antd-style';
import { readableColor } from 'polished';

export default (token: Theme) => css`
  .${token.prefixCls}-btn {
    box-shadow: none;
  }

  .${token.prefixCls}-btn-primary {
    color: ${readableColor(token.colorPrimary)} !important;

    &:hover {
      color: ${readableColor(token.colorPrimary)} !important;
    }

    &:active {
      color: ${readableColor(token.colorPrimaryActive)} !important;
    }
  }

  .${token.prefixCls}-tooltip-inner {
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: unset;
    padding: 4px 8px;

    color: ${token.colorBgLayout} !important;

    background-color: ${token.colorText} !important;
    border-radius: ${token.borderRadiusSM}px !important;
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

  .${token.prefixCls}-alert {
    span[role='img'] {
      align-self: flex-start;
      width: 16px;
      height: 16px;
      margin-top: 3px;
    }

    .${token.prefixCls}-alert-description {
      word-break: break-all;
      word-wrap: break-word;
    }

    &.${token.prefixCls}-alert-with-description {
      padding-block: 12px;
      padding-inline: 12px;

      .${token.prefixCls}-alert-message {
        font-size: 14px;
        font-weight: 600;
        word-break: break-all;
        word-wrap: break-word;
      }
    }
  }

  @media (max-width: 575px) {
    .${token.prefixCls}-tooltip {
      display: none !important;
    }
  }
`;
