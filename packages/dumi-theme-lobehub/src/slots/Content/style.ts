import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, responsive, css, stylish }) => ({
  content: css`
    flex: 1;

    box-sizing: border-box;
    width: 100%;
    min-height: 400px;
    padding: 24px 48px;

    background-color: ${token.colorBgContainer};
    border-radius: 10px;
    box-shadow: ${token.boxShadowTertiary};

    &:has([data-page-tabs='true']) {
      padding-top: 8px;
    }

    ${responsive.mobile} {
      padding: 8px 16px;
      border-radius: 0;
    }

    .markdown {
      ${stylish.markdown};
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        > a[aria-hidden]:first-child {
          float: left;

          width: 20px;
          margin-inline-start: -24px;
          padding-inline-end: 4px;

          font-size: inherit;
          line-height: inherit;
          color: ${token.colorText};
          text-align: right;

          &:hover {
            border: 0;
          }

          > .icon-link::before {
            content: '#';
            font-size: inherit;
            color: ${token.colorTextTertiary};
          }
        }

        &:not(:hover) > a[aria-hidden]:first-child > .icon-link {
          visibility: hidden;
        }
      }
    }
  `,
}));
