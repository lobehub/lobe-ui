import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  sidebar: css`
    margin-top: ${token.headerHeight}px;
  `,
  sidebarInner: css`
    overflow: auto;
    width: 100%;
    height: 100%;
    padding: 16px;
    dl {
      margin: 0;
      padding: 0;
      line-height: 1;

      > dt {
        overflow: hidden;

        margin: 8px 0;

        font-weight: 500;
        color: ${token.colorText};
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      > dd {
        margin: 0;
        padding: 2px 0;

        > a {
          overflow: hidden;
          display: block;

          padding: 6px 12px;

          font-size: ${token.fontSize}px;
          line-height: ${token.lineHeight};
          color: ${token.colorTextSecondary};
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;

          border-radius: 6px;

          transition: color 600ms ${token.motionEaseOut},
            background-color 100ms ${token.motionEaseOut};
          &:hover {
            color: ${token.colorText};
            background: ${token.colorFillTertiary};
          }
          &:active {
            color: ${token.colorText};
            background-color: ${token.colorFill};
          }

          &.active {
            color: ${token.colorText};
            background-color: ${token.colorFillTertiary};

            &:hover {
              color: ${token.colorText};
              background: ${token.colorFillSecondary};
            }
            &:active {
              color: ${token.colorText};
              background-color: ${token.colorFill};
            }
          }
        }
      }

      // divider line & gap
      + dl {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px dashed ${token.colorBorder};
      }
    }
  `,
}));
