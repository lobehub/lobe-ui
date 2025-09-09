import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode }) => {
  const cyanColor = isDarkMode ? token.cyan9A : token.cyan11A;

  return {
    chat: css`
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

    gfm: css`
      .markdown-alert {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        padding-inline-start: 1em;
        border-inline-start: solid 4px ${token.colorBorder};

        > p {
          margin-block-start: 0 !important;
        }
      }

      .markdown-alert > :first-child {
        margin-block-start: 0;
      }

      .markdown-alert > :last-child {
        margin-block-end: 0;
      }

      .markdown-alert-note {
        border-inline-start-color: ${token.colorInfo};
      }

      .markdown-alert-tip {
        border-inline-start-color: ${token.colorSuccess};
      }

      .markdown-alert-important {
        border-inline-start-color: ${token.purple};
      }

      .markdown-alert-warning {
        border-inline-start-color: ${token.colorWarning};
      }

      .markdown-alert-caution {
        border-inline-start-color: ${token.colorError};
      }

      .markdown-alert-title {
        display: flex;
        align-items: center;
        margin-block-end: 0.5em !important;
        font-weight: 500;
      }

      .markdown-alert-note .markdown-alert-title {
        color: ${token.colorInfo};
        fill: ${token.colorInfo};
      }

      .markdown-alert-tip .markdown-alert-title {
        color: ${token.colorSuccess};
        fill: ${token.colorSuccess};
      }

      .markdown-alert-important .markdown-alert-title {
        color: ${token.purple};
        fill: ${token.purple};
      }

      .markdown-alert-warning .markdown-alert-title {
        color: ${token.colorWarning};
        fill: ${token.colorWarning};
      }

      .markdown-alert-caution .markdown-alert-title {
        color: ${token.colorError};
        fill: ${token.colorError};
      }

      /* Style the footnotes section. */

      .octicon {
        overflow: visible !important;
        display: inline-block;
        margin-inline-end: 0.5em;
        vertical-align: text-bottom;
      }

      .sr-only {
        position: absolute;

        overflow: hidden;

        width: 1px;
        height: 1px;
        padding: 0;
        border: 0;

        word-wrap: normal;

        clip: rect(0, 0, 0, 0);
      }

      sup:has(*[aria-describedby='footnote-label']) {
        margin-inline: 2px;
        vertical-align: super !important;

        [data-footnote-ref] {
          display: inline-block;

          width: 16px;
          height: 16px;
          border-radius: 4px;

          font-family: ${token.fontFamilyCode};
          font-size: 10px;
          color: ${token.colorTextSecondary} !important;
          text-align: center;

          background: ${token.colorFillSecondary};
        }
      }

      code.color-preview {
        position: relative;
        display: inline-flex !important;
        gap: 0.4em;

        &::after {
          content: '';

          width: 0.66em;
          height: 0.66em;
          border: 1px solid ${token.colorFill};
          border-radius: 50%;

          background-color: attr(data-color);

          /* Fallback for browsers that don't support attr() in background */
          background-color: var(--color-preview-color, #000);
        }
      }
    `,

    latex: css`
      .katex-error {
        color: ${token.colorTextDescription} !important;
      }

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
    `,
  };
});
