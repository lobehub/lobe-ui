import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish }) => ({
  content: css`
    width: 100%;
    max-width: ${token.contentMaxWidth}px;
    margin: 0 auto;
  `,
  changelog: css`
    .markdown {
      font-size: 16px;

      h1 {
        display: none;
      }

      h2,
      h3 {
        margin-bottom: 0;
        font-size: 28px;
      }

      sup {
        color: ${token.colorTextDescription};
      }

      details {
        font-size: 14px;
      }

      summary > kbd {
        margin-left: 6px;
      }

      a[href='/changelog#readme-top'] {
        display: block;
        margin-bottom: 32px;
        padding-bottom: 32px;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        > img {
          display: none;
        }
      }
    }
  `,
  background: css`
    z-index: 0;

    ${stylish.gradientAnimation};
    filter: blur(100px);

    pointer-events: none;

    width: 60vw;
    height: 200px;

    right: -20vw;
    top: -100px;
    position: absolute;

    opacity: 0.2;

    transform: rotate(4deg);
  `,
}));
