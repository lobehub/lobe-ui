import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { token, isDarkMode, css },
    {
      fontSize = 16,
      headerMultiple = 1,
      marginMultiple = 1.5,
      lineHeight = 1.8,
    }: { fontSize?: number; headerMultiple?: number; lineHeight?: number; marginMultiple?: number },
  ) => {
    return {
      __root: css`
        --lobe-markdown-font-size: ${fontSize}px;
        --lobe-markdown-header-multiple: ${headerMultiple};
        --lobe-markdown-margin-multiple: ${marginMultiple};
        --lobe-markdown-line-height: ${lineHeight};

        position: relative;

        width: 100%;

        font-size: var(--lobe-markdown-font-size);
        line-height: var(--lobe-markdown-line-height);
        word-break: break-word;
      `,
      a: css`
        a {
          color: ${token.colorInfoText};

          &:hover {
            color: ${token.colorInfoHover};
          }
        }
      `,
      blockquote: css`
        blockquote {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          margin-inline: 0;
          padding-block: 0;
          padding-inline: 1em;

          color: ${token.colorTextSecondary};

          border-inline-start: solid 4px ${token.colorBorder};
        }
      `,
      code: css`
        code:not(:has(span)) {
          display: inline-block;

          padding-block: 0.2em;
          padding-inline: 0.4em;

          font-family: ${token.fontFamilyCode};
          font-size: 0.875em;
          line-height: 1;
          word-break: break-word;

          background: ${token.colorFillSecondary};
          border: 1px solid ${token.colorBorderSecondary};
          border-radius: ${token.borderRadiusLG}px;
        }
      `,
      details: css`
        details {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          padding-block: 0.75em;
          padding-inline: 1em;

          background: ${token.colorFillTertiary};
          border-radius: ${token.borderRadiusLG}px;
          box-shadow: inset 0 0 0 1px ${token.colorBorderSecondary};

          summary {
            cursor: pointer;
            display: flex;
            align-items: center;
            list-style: none;

            &::before {
              content: '';

              position: absolute;
              inset-inline-end: 1.25em;
              transform: rotateZ(-45deg);

              display: block;

              width: 0.4em;
              height: 0.4em;

              font-family: ${token.fontFamily};

              border-block-end: 1.5px solid ${token.colorTextSecondary};
              border-inline-end: 1.5px solid ${token.colorTextSecondary};

              transition: transform 200ms ${token.motionEaseOut};
            }
          }

          &[open] {
            padding-block-end: 0;

            summary {
              padding-block-end: 12px;
              border-block-end: 1px dashed ${token.colorBorder};

              &::before {
                transform: rotateZ(45deg);
              }
            }
          }
        }
      `,
      header: css`
        h1,
        h2,
        h3,
        h4,
        h5 {
          margin-block: max(
            calc(
              var(--lobe-markdown-header-multiple) * var(--lobe-markdown-margin-multiple) * 0.4em
            ),
            var(--lobe-markdown-font-size)
          );
          font-weight: 600;
        }

        h1 {
          font-size: calc(
            var(--lobe-markdown-font-size) * (1 + 1.5 * var(--lobe-markdown-header-multiple))
          );
        }

        h2 {
          font-size: calc(
            var(--lobe-markdown-font-size) * (1 + var(--lobe-markdown-header-multiple))
          );
        }

        h3 {
          font-size: calc(
            var(--lobe-markdown-font-size) * (1 + 0.5 * var(--lobe-markdown-header-multiple))
          );
        }

        h4 {
          font-size: calc(
            var(--lobe-markdown-font-size) * (1 + 0.25 * var(--lobe-markdown-header-multiple))
          );
        }

        h5 {
          font-size: calc(var(--lobe-markdown-font-size) * 1);
        }
      `,
      hr: css`
        hr {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1.5em);

          border-color: ${token.colorBorderSecondary};
          border-style: dashed;
          border-width: 1px;
          border-block-start: none;
          border-inline-start: none;
          border-inline-end: none;
        }
      `,

      img: css`
        img {
          max-width: 100%;
        }
      `,
      kbd: css`
        kbd {
          cursor: default;
          user-select: none;

          transform: translateY(-0.2em);

          display: inline-block;

          min-width: 1em;
          margin-inline: 0.25em;
          padding-block: 0.2em;
          padding-inline: 0.4em;

          font-family: ${token.fontFamily};
          font-size: 0.875em;
          font-weight: 500;
          line-height: 1;
          color: ${token.colorBgLayout};
          text-align: center;

          background: ${isDarkMode ? token.colorText : '#333'};
          border: 1px solid ${isDarkMode ? token.colorTextSecondary : '#000'};
          border-radius: 0.25em;
          box-shadow: 0 2px 0 1px ${isDarkMode ? token.colorTextSecondary : '#000'};

          &:hover {
            transform: translateY(0);
            box-shadow: none;
          }
        }
      `,
      list: css`
        li {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        }

        ul,
        ol {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          margin-inline-start: 1em;
          list-style-position: outside;

          li {
            margin-inline-start: 1em;
          }
        }

        ol {
          list-style: auto;

          li {
            &::marker {
              opacity: 0.75;
            }
          }
        }

        ul {
          list-style-type: none;

          li {
            &::before {
              content: '-';
              display: inline-block;
              margin-inline: -1em 0.5em;
              opacity: 0.5;
            }
          }
        }
      `,
      p: css`
        p {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          line-height: var(--lobe-markdown-line-height);
          letter-spacing: 0.02em;
        }
      `,
      pre: css`
        pre,
        [data-code-type='highlighter'] {
          border: none;

          > code {
            padding: 0 !important;

            font-family: ${token.fontFamilyCode};
            font-size: 0.875em;
            line-height: 1.6;

            border: none !important;
          }
        }
      `,
      strong: css`
        strong {
          font-weight: 600;
        }
      `,
      table: css`
        table {
          overflow: hidden;
          display: table;
          border-spacing: 0;
          border-collapse: collapse;

          box-sizing: border-box;
          width: 100%;
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);

          text-align: start;
          overflow-wrap: break-word;

          background: ${token.colorFillQuaternary};
          border-radius: ${token.borderRadiusLG}px;
          box-shadow: inset 0 0 0 1px ${token.colorBorderSecondary};

          thead {
            background: ${token.colorFillQuaternary};
          }

          tr {
            box-shadow: inset 0 -1px 0 ${token.colorBorderSecondary};
          }

          th,
          td {
            padding-block: 0.75em;
            padding-inline: 1em;
            text-align: start;
            vertical-align: top;
          }
        }
      `,
      video: css`
        video {
          max-width: 100%;
        }
      `,
    };
  },
);
