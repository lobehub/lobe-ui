import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, token, isDarkMode },
    {
      fontSize = 14,
      headerMultiple = 0.25,
      marginMultiple = 1,
      lineHeight = 1.6,
    }: { fontSize?: number; headerMultiple?: number; lineHeight?: number; marginMultiple?: number },
  ) => {
    const cyanColor = isDarkMode ? token.cyan9A : token.cyan11A;
    return {
      chat: css`
        --lobe-markdown-font-size: ${fontSize}px;
        --lobe-markdown-header-multiple: ${headerMultiple};
        --lobe-markdown-margin-multiple: ${marginMultiple};
        --lobe-markdown-line-height: ${lineHeight};
        --lobe-markdown-border-radius: ${token.borderRadius};

        ol,
        ul {
          li {
            &::marker {
              color: ${cyanColor} !important;
            }

            li {
              &::marker {
                color: ${token.colorTextSecondary} !important;
              }
            }
          }
        }

        ul {
          list-style: unset;

          li {
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
        }

        .katex-html:has(span.tag) {
          display: flex !important;
        }

        .katex-html > .tag {
          position: relative !important;
          float: right;
          margin-inline-start: 0.25rem;
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
  },
);
