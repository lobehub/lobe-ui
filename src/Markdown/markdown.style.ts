import { createStyles } from 'antd-style';
import { rgba } from 'polished';

const IGNORE_CLASSNAME = '.ignore-markdown-style';

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
        --lobe-markdown-border-radius: ${token.borderRadiusLG};
        --lobe-markdown-border-color: ${isDarkMode
          ? token.colorBorderSecondary
          : rgba(token.colorBorderSecondary, 0.5)};

        position: relative;

        width: 100%;
        max-width: 100%;
        padding-inline: 1px;

        font-size: var(--lobe-markdown-font-size);
        line-height: var(--lobe-markdown-line-height);
        word-break: break-word;

        ${IGNORE_CLASSNAME} {
          font-size: 14px;
          line-height: 1.5;
        }
      `,
      a: css`
        a:not(${IGNORE_CLASSNAME} a) {
          color: ${token.colorInfoText};

          &:hover {
            color: ${token.colorInfoHover};
          }
        }
      `,
      blockquote: css`
        blockquote:not(${IGNORE_CLASSNAME} blockquote) {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          margin-inline: 0;
          padding-block: 0;
          padding-inline: 1em;

          color: ${token.colorTextSecondary};

          border-inline-start: solid 4px ${token.colorBorder};
        }
      `,
      code: css`
        code:not(${IGNORE_CLASSNAME} code) {
          &:not(:has(span)) {
            display: inline;

            margin-inline: 0.25em;
            padding-block: 0.2em;
            padding-inline: 0.4em;

            font-family: ${token.fontFamilyCode};
            font-size: 0.875em;
            line-height: 1;
            word-break: break-word;
            white-space: break-spaces;

            background: ${token.colorFillSecondary};
            border: 1px solid var(--lobe-markdown-border-color);
            border-radius: 0.25em;
          }
        }
      `,
      details: css`
        details:not(${IGNORE_CLASSNAME} details) {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          padding-block: 0.75em;
          padding-inline: 1em;

          background: ${token.colorFillTertiary};
          border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
          box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);

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
            summary {
              padding-block-end: 0.75em;
              border-block-end: 1px dashed ${token.colorBorder};

              &::before {
                transform: rotateZ(45deg);
              }
            }
          }
        }
      `,
      header: css`
        h1:not(${IGNORE_CLASSNAME} h1),
        h2:not(${IGNORE_CLASSNAME} h2),
        h3:not(${IGNORE_CLASSNAME} h3),
        h4:not(${IGNORE_CLASSNAME} h4),
        h5:not(${IGNORE_CLASSNAME} h5),
        h6:not(${IGNORE_CLASSNAME} h6) {
          margin-block: max(
            calc(
              var(--lobe-markdown-header-multiple) * var(--lobe-markdown-margin-multiple) * 0.4em
            ),
            var(--lobe-markdown-font-size)
          );
          font-weight: bold;
          line-height: 1.25;
        }

        h1:not(${IGNORE_CLASSNAME} h1) {
          font-size: calc(
            var(--lobe-markdown-font-size) * (1 + 1.5 * var(--lobe-markdown-header-multiple))
          );
        }

        h2:not(${IGNORE_CLASSNAME} h2) {
          font-size: calc(
            var(--lobe-markdown-font-size) * (1 + var(--lobe-markdown-header-multiple))
          );
        }

        h3:not(${IGNORE_CLASSNAME} h3) {
          font-size: calc(
            var(--lobe-markdown-font-size) * (1 + 0.5 * var(--lobe-markdown-header-multiple))
          );
        }

        h4:not(${IGNORE_CLASSNAME} h4) {
          font-size: calc(
            var(--lobe-markdown-font-size) * (1 + 0.25 * var(--lobe-markdown-header-multiple))
          );
        }

        h5:not(${IGNORE_CLASSNAME} h5),
        h6:not(${IGNORE_CLASSNAME} h6) {
          font-size: calc(var(--lobe-markdown-font-size) * 1);
        }
      `,
      hr: css`
        hr:not(${IGNORE_CLASSNAME} hr) {
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
        img:not(${IGNORE_CLASSNAME} img) {
          max-width: 100%;
        }

        > img,
        > p > img {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
          box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
        }
      `,

      kbd: css`
        kbd:not(${IGNORE_CLASSNAME} kbd) {
          cursor: default;

          display: inline-block;

          min-width: 1em;
          margin-inline: 0.25em;
          padding-block: 0.2em;
          padding-inline: 0.4em;

          font-family: ${token.fontFamily};
          font-size: 0.875em;
          font-weight: 500;
          line-height: 1;
          text-align: center;

          background: ${token.colorBgLayout};
          border: 1px solid ${token.colorBorderSecondary};
          border-radius: 0.25em;
        }
      `,
      list: css`
        li:not(${IGNORE_CLASSNAME} li) {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.33em);

          p {
            display: inline;
          }
        }

        ul:not(${IGNORE_CLASSNAME} ul),
        ol:not(${IGNORE_CLASSNAME} ol) {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          margin-inline-start: 1em;
          padding-inline-start: 0;
          list-style-position: outside;

          > ul,
          > ol {
            margin-block: 0;
          }

          > li {
            margin-inline-start: 1em;
          }
        }

        ol:not(${IGNORE_CLASSNAME} ol) {
          list-style: auto;
        }

        ul:not(${IGNORE_CLASSNAME} ul) {
          list-style-type: none;

          > li {
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
        p:not(${IGNORE_CLASSNAME} kbd) {
          margin-block: 4px;
          line-height: var(--lobe-markdown-line-height);
          letter-spacing: 0.02em;

          &:not(:first-child) {
            margin-block-start: calc(var(--lobe-markdown-margin-multiple) * 1em);
          }

          &:not(:last-child) {
            margin-block-end: calc(var(--lobe-markdown-margin-multiple) * 1em);
          }
        }
      `,
      pre: css`
        pre:not(${IGNORE_CLASSNAME} pre),
        [data-code-type='highlighter'] {
          white-space: break-spaces;
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
        strong:not(${IGNORE_CLASSNAME} strong) {
          font-weight: 600;
        }
      `,
      svg: css`
        svg:not(${IGNORE_CLASSNAME} svg) {
          line-height: 1;
        }
      `,
      table: css`
        table:not(${IGNORE_CLASSNAME} table) {
          unicode-bidi: isolate;
          overflow: auto hidden;
          display: block;
          border-spacing: 0;
          border-collapse: collapse;

          box-sizing: border-box;
          width: max-content;
          max-width: 100%;
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);

          text-align: start;
          text-indent: initial;
          text-wrap: pretty;
          word-break: auto-phrase;
          overflow-wrap: break-word;

          background: ${token.colorFillQuaternary};
          border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
          box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);

          code {
            word-break: break-word;
          }

          thead {
            background: ${token.colorFillQuaternary};
          }

          tr {
            box-shadow: 0 1px 0 var(--lobe-markdown-border-color);
          }

          th,
          td {
            min-width: 120px;
            padding-block: 0.75em;
            padding-inline: 1em;
            text-align: start;
          }
        }
      `,
      video: css`
        > video:not(${IGNORE_CLASSNAME} video),
        > p:not(${IGNORE_CLASSNAME} p) > video {
          margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
          border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
          box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
        }

        video:not(${IGNORE_CLASSNAME} video) {
          max-width: 100%;
        }
      `,
    };
  },
);
