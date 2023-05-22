import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  sidebar: css`
    margin-top: ${token.headerHeight}px;
  `,
  sidebarInner: css`
    padding: 16px;
    dl {
      margin: 0;
      padding: 0;
      line-height: 1;

      > dt {
        margin: 8px 0;
        color: ${token.colorText};
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
      }

      > dd {
        margin: 0;
        padding: 2px 0;

        > a {
          padding: 6px 12px;
          border-radius: 6px;
          display: block;
          font-size: ${token.fontSize}px;
          line-height: ${token.lineHeight};
          text-decoration: none;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          color: ${token.colorTextSecondary};
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
