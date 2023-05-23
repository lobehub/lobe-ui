import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, responsive, isDarkMode, css }) => ({
  content: css`
    min-height: 400px;
    flex: 1;
    width: 100%;
    box-sizing: border-box;

    padding: 24px 48px;
    border-radius: 10px;
    background-color: ${token.colorBgContainer};
    box-shadow: ${token.boxShadowTertiary};

    &:has([data-page-tabs='true']) {
      padding-top: 8px;
    }

    ${responsive.mobile} {
      padding: 8px 16px;
      border-radius: 0;
    }

    .markdown {
      color: ${isDarkMode ? token.colorTextSecondary : token.colorText};

      h1,
      h2,
      h3,
      h4,
      h5 {
        font-weight: 600;
      }

      p {
        margin: 20px auto;
        line-height: 2;
        word-wrap: break-word;
        font-size: 14px;
        color: ${token.colorText};

        &:not(:last-child) {
          margin-bottom: 1em;
        }
      }

      // hyperlink
      a {
        color: ${token.colorLink};

        &:hover {
          color: ${token.colorLinkHover};
        }

        &:active {
          color: ${token.colorLinkActive};
        }
      }

      img {
        max-width: 100%;
      }

      // inline code
      > :not([data-code-type='highlighter']) code {
        padding: 2px 6px;
        color: ${isDarkMode ? token['cyan-7'] : token.colorPrimaryText};
        background: ${isDarkMode ? token['cyan-1'] : token.colorPrimaryBg};
        border-radius: 4px;
      }

      // table
      table {
        width: 100%;
        border-spacing: 0;
        border: 1px solid ${token.colorBorder};
        border-radius: ${token.borderRadius}px;
        padding: 8px;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
      }

      th {
      }

      thead {
        tr {
          th {
            background: ${token.colorFillTertiary};
            &:first-child {
              border-top-left-radius: ${token.borderRadius}px;
              border-bottom-left-radius: ${token.borderRadius}px;
            }
            &:last-child {
              border-top-right-radius: ${token.borderRadius}px;
              border-bottom-right-radius: ${token.borderRadius}px;
            }
          }
        }
      }

      th,
      td {
        padding-block-start: 10px;
        padding-block-end: 10px;
        padding-inline-start: 16px;
        padding-inline-end: 16px;
      }

      // blockquote
      blockquote {
        margin: 16px 0;
        padding: 0 12px;
        p {
          font-style: italic;
          color: ${token.colorTextDescription};
        }
      }

      // list
      ul li {
        line-height: 1.8;
      }

      // anchor of headings
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        > a[aria-hidden]:first-child {
          float: left;
          width: 20px;
          padding-inline-end: 4px;
          margin-inline-start: -24px;
          color: ${token.colorText};
          // hide phantom blank node
          font-size: inherit;
          text-align: right;
          line-height: inherit;

          &:hover {
            border: 0;
          }

          > .icon-link::before {
            content: '#';
            color: ${token.colorTextTertiary};
            font-size: inherit;
          }
        }

        &:not(:hover) > a[aria-hidden]:first-child > .icon-link {
          visibility: hidden;
        }
      }
    }
  `,
}));
