import styled from '@emotion/styled';
import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const FillRect = styled.div`
  background: ${(p) => rgba(p.theme.colorBgContainer, 0.8)};

  width: 100%;
` as any;

export const useStyles = createStyles(({ token, prefixCls, cx, css }) => {
  const offset = 6;

  return {
    icon: cx(
      'site-burger-icon',
      css`
        position: relative;

        &,
        &::before,
        &::after {
          display: inline-block;
          height: 2px;
          background: ${token.colorTextSecondary};

          width: 16px;

          transition: all 150ms ease;
        }

        &::before,
        &::after {
          position: absolute;
          left: 0;

          content: '';
        }

        &::before {
          top: ${offset}px;
        }

        &::after {
          top: -${offset}px;
        }
      `,
    ),
    active: css`
      &::before,
      &::after {
        background: ${token.colorText};
      }
      & {
        background: transparent;
      }

      &::before {
        top: 0;
        transform: rotate(-135deg);
      }

      &::after {
        top: 0;
        transform: rotate(135deg);
      }
    `,
    container: css`
      width: ${token.controlHeight}px;
      height: ${token.controlHeight}px;
      border-radius: ${token.borderRadius}px;
      cursor: pointer;
    `,

    drawerRoot: css`
      top: ${token.headerHeight + 1}px;

      :focus-visible {
        outline: none;
      }

      .${prefixCls}-drawer {
        &-mask {
          background: transparent;
          backdrop-filter: blur(7px);
          background: ${rgba(token.colorBgBase, 0.5)};
        }

        &-content-wrapper {
          box-shadow: none;
        }
      }
    `,
    drawer: css`
      &.${prefixCls}-drawer-content {
        background: transparent;
      }

      .${prefixCls}-drawer-body {
        display: flex;
        flex-direction: column;
      }
    `,

    menu: css`
      background: transparent;
      border-inline-end: transparent !important;

      > .${prefixCls}-menu-item-only-child,.${prefixCls}-menu-submenu-title {
        background: ${rgba(token.colorBgContainer, 0.8)};
        border-radius: 0;
        margin: 0;
        width: 100%;
        &:active {
          margin-inline: 4px;
          border-radius: ${token.borderRadius}px;
        }
      }

      .${prefixCls}-menu-sub.${prefixCls}-menu-inline {
        //background: transparent !important;
        background: ${rgba(token.colorBgContainer, 0.2)} !important;
      }
    `,
  };
});
