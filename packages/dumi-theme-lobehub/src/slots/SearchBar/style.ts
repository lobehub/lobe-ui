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

      overflow: auto;
      overscroll-behavior: contain;
      flex: 1;

      width: 540px;
      min-height: 60px;
      max-height: 400px;
      margin-top: 8px;

      background-color: ${token.colorBgElevated};
      border: 1px solid ${token.colorBorder};
      border-radius: ${token.borderRadiusLG}px;
      box-shadow: ${token.boxShadow};

      -webkit-overflow-scrolling: touch;

      .dumi-default-search-result {
        > dl {
          > dt {
            color: ${token.colorText};
            background: ${token.colorFillTertiary};
          }

          > dd {
            > a {
              > h4 {
                color: ${token.colorTextSecondary};
              }

              > p {
                color: ${token.colorTextDescription};
              }

              &:hover {
                background: ${token.colorFillSecondary};
              }
            }

            + dd {
              border-color: ${token.colorBorderSecondary};
            }
          }
        }

        mark {
          color: #000;
          background: ${token.yellow9};
        }
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
