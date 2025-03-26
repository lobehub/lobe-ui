import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode }) => {
  const cyanColor = isDarkMode ? token.cyan9A : token.cyan11A;
  return {
    chat: css`
      --lobe-markdown-border-radius: ${token.borderRadius};

      ol,
      ul {
        > li {
          &::marker {
            color: ${cyanColor} !important;
          }

          > li {
            &::marker {
              color: ${token.colorTextSecondary} !important;
            }
          }
        }
      }

      ul {
        list-style: unset;

        > li {
          &::before {
            content: unset;
            display: unset;
          }
        }
      }
    `,
    latex: css`
      .katex-html {
        overflow: auto hidden;
        padding: 3px;

        .base {
          margin-block: 0;
          margin-inline: auto;
        }

        .tag {
          position: relative !important;
          display: inline-block;
          padding-inline-start: 0.5rem;
        }
      }
    `,
    root: css`
      position: relative;
      overflow: hidden;
      max-width: 100%;

      #footnote-label {
        display: none;
      }

      sup:has(a[aria-describedby='footnote-label']) {
        vertical-align: super !important;
      }
    `,
  };
});
