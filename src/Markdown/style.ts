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

        margin-block: ${marginMultiple * -0.75}em;

        /* 解决只有一个子节点时高度坍缩的问题 */
        :first-child:not(:has(*)) {
          margin-block: 0;
        }

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
          overflow: scroll hidden;
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
          margin-inline: 0.2em;
          padding-block: 0.05em;
          padding-inline: 0.4em;

          font-size: 0.75em;
          vertical-align: super !important;

          background: ${token.colorFillTertiary};
          border: 1px solid ${token.colorBorderSecondary};
          border-radius: 0.25em;
        }

        section.footnotes {
          padding-block: 1em;
          font-size: 0.875em;
          color: ${token.colorTextSecondary};

          ol {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5em;

            margin: 0;
            padding: 0;

            list-style-type: none;
          }

          ol li {
            position: relative;

            overflow: hidden;
            display: flex;
            flex-direction: row;

            margin: 0 !important;
            padding-block: 0 !important;
            padding-inline: 0 0.4em !important;

            text-overflow: ellipsis;
            white-space: nowrap;

            border: 1px solid ${token.colorBorderSecondary};
            border-radius: 0.25em;

            &::before {
              content: counter(list-item);
              counter-increment: list-item;

              display: block;

              margin-inline-end: 0.4em;
              padding-inline: 0.6em;

              background: ${token.colorFillSecondary};
            }

            p,
            a {
              overflow: hidden;

              margin: 0 !important;
              padding: 0 !important;

              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      `,
    };
  },
);
