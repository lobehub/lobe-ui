import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, responsive, css, cx }) => {
  return {
    container: css`
      position: relative;

      // TODO: support search for mobile devices
      ${responsive.mobile} {
        display: none;
      }
    `,
    shortcut: cx(
      'site-header-shortcut',
      css`
        pointer-events: none;

        position: absolute;
        top: 50%;
        inset-inline-end: 11px;
        transform: translateY(-50%);

        display: inline-block;

        padding: 4px 8px;

        font-size: 12px;
        line-height: 1;
        color: ${token.colorTextDescription};
        white-space: nowrap;

        background-color: ${token.colorFillSecondary};
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: 11px;

        transition: all 0.3s;

        ${responsive.mobile} {
          display: none;
        }
      `,
    ),
    popover: css`
      position: absolute;
      top: 100%;
      inset-inline-end: 0;

      display: flex;
      flex-direction: column;

      width: 540px;
      max-height: 460px;
      margin-top: 18px;

      background-color: ${token.colorBgElevated};
      border-radius: 8px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 20%);

      &::before {
        content: '';

        position: absolute;
        bottom: 100%;
        inset-inline-end: 100px;

        display: inline-block;

        width: 0;
        height: 0;

        border: 8px solid transparent;
        border-bottom-color: #fff;
      }

      > section {
        overflow: auto;
        overscroll-behavior: contain;
        flex: 1;

        min-height: 60px;

        border-radius: inherit;

        -webkit-overflow-scrolling: touch;
      }
    `,

    svg: cx(
      css`
        position: absolute;
        top: 50%;
        inset-inline-start: 16px;
        transform: translateY(-50%);

        width: 16px;
        margin-top: 1px;

        color: ${token.colorTextPlaceholder};
      `,
    ),
    input: css`
      box-sizing: border-box;
      width: 280px;
      height: ${token.controlHeightLG}px;
      padding: 0;
      padding-inline-start: 40px;
      padding-inline-end: 12px;

      font-size: 14px;
      color: ${token.colorTextSecondary};

      background-color: transparent;
      border: 1px solid ${token.colorBorder};
      border-radius: 20px;
      outline: none;

      transition: all 0.3s;

      &::input-placeholder {
        color: ${token.colorTextPlaceholder};
      }

      &:focus {
        background: ${token.colorBgElevated};
        border-color: ${token.colorBorderSecondary};

        ~ .site-header-shortcut {
          opacity: 0;
        }
      }
    `,
  };
});
