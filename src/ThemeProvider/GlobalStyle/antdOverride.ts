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

  @media (max-width: 575px) {
    .${token.prefixCls}-tooltip {
      display: none !important;
    }
  }
`;
