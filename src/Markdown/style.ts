import { createStyles, keyframes } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode }) => {
  const cyanColor = isDarkMode ? token.cyan9A : token.cyan11A;
  const fadeIn = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `;
  return {
    animated: css`
      .animate-fade-in,
      .katex-html span,
      span.line > span,
      code:not(:has(span.line)),
      > * {
        animation: ${fadeIn} 1s ease-in-out;
      }
    `,
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

      .octicon {
        overflow: visible !important;
        display: inline-block;
        margin-inline-end: 0.5em;
        vertical-align: text-bottom;
      }

      .task-list-item {
        &::before {
          display: none !important;
        }

        input[type='checkbox'] {
          margin-block: 0 0.25em;
          margin-inline: -1.6em 0.2em;
          vertical-align: middle;
        }

        input[type='checkbox']:dir(rtl) {
          margin: 0 -1.6em 0.25em 0.2em;
        }
      }

      /* Style the footnotes section. */

      .footnotes {
        margin-block-start: calc(var(--lobe-markdown-margin-multiple) * 1em);
        font-size: smaller;
        color: #8b949e;

        #footnote-label {
          display: none;
        }

        > ol {
          margin: 0 !important;
        }
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

      sup:has(a[aria-describedby='footnote-label']) {
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
