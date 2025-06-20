import { createStyles } from 'antd-style';

const IGNORE_CLASSNAME = '.ignore-markdown-style';

export const useStyles = createStyles(
  (
    { cx, token, css },
    {
      fontSize = 16,
      headerMultiple = 1,
      marginMultiple = 2,
      lineHeight = 1.8,
    }: { fontSize?: number; headerMultiple?: number; lineHeight?: number; marginMultiple?: number },
  ) => {
    const __root = css`
      --lobe-markdown-font-size: ${fontSize}px;
      --lobe-markdown-header-multiple: ${headerMultiple};
      --lobe-markdown-margin-multiple: ${marginMultiple};
      --lobe-markdown-line-height: ${lineHeight};
      --lobe-markdown-border-radius: ${token.borderRadiusLG};
      --lobe-markdown-border-color: ${token.colorFillQuaternary};

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
    `;
    const a = css`
      a:not(${IGNORE_CLASSNAME} a) {
        color: ${token.colorInfoText};

        &:hover {
          color: ${token.colorInfoHover};
        }
      }
    `;
    const blockquote = css`
      blockquote:not(${IGNORE_CLASSNAME} blockquote) {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        margin-inline: 0;
        padding-block: 0;
        padding-inline: 1em;
        border-inline-start: solid 4px ${token.colorBorder};

        color: ${token.colorTextSecondary};
      }
    `;
    const code = css`
      code:not(${IGNORE_CLASSNAME} code) {
        &:not(:has(span)) {
          display: inline;

          margin-inline: 0.25em;
          padding-block: 0.2em;
          padding-inline: 0.4em;
          border: 1px solid var(--lobe-markdown-border-color);
          border-radius: 0.25em;

          font-family: ${token.fontFamilyCode};
          font-size: 0.875em;
          line-height: 1;
          word-break: break-word;
          white-space: break-spaces;

          background: ${token.colorFillSecondary};
        }
      }
    `;
    const details = css`
      details:not(${IGNORE_CLASSNAME} details) {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        padding-block: 0.75em;
        padding-inline: 1em;
        border-radius: calc(var(--lobe-markdown-border-radius) * 1px);

        background: ${token.colorFillTertiary};
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
            border-block-end: 1.5px solid ${token.colorTextSecondary};
            border-inline-end: 1.5px solid ${token.colorTextSecondary};

            font-family: ${token.fontFamily};

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
    `;
    const header = css`
      h1:not(${IGNORE_CLASSNAME} h1),
      h2:not(${IGNORE_CLASSNAME} h2),
      h3:not(${IGNORE_CLASSNAME} h3),
      h4:not(${IGNORE_CLASSNAME} h4),
      h5:not(${IGNORE_CLASSNAME} h5),
      h6:not(${IGNORE_CLASSNAME} h6) {
        margin-block: max(
          calc(var(--lobe-markdown-header-multiple) * var(--lobe-markdown-margin-multiple) * 0.4em),
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
    `;
    const hr = css`
      hr:not(${IGNORE_CLASSNAME} hr) {
        width: 100%;
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 1.5em);
        border-color: ${token.colorBorder};
        border-style: dashed;
        border-width: 1px;
        border-block-start: none;
        border-inline-start: none;
        border-inline-end: none;
      }
    `;
    const img = css`
      img:not(${IGNORE_CLASSNAME} img) {
        max-width: 100%;
      }

      > img,
      > p > img {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
        box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
      }
    `;
    const kbd = css`
      kbd:not(${IGNORE_CLASSNAME} kbd) {
        cursor: default;

        display: inline-block;

        min-width: 1em;
        margin-inline: 0.25em;
        padding-block: 0.2em;
        padding-inline: 0.4em;
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: 0.25em;

        font-family: ${token.fontFamily};
        font-size: 0.875em;
        font-weight: 500;
        line-height: 1;
        text-align: center;

        background: ${token.colorBgLayout};
      }
    `;
    const list = css`
      li:not(${IGNORE_CLASSNAME} li) {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.33em);

        p {
          display: inline;
        }
      }

      ul:not(${IGNORE_CLASSNAME} ul),
      ol:not(${IGNORE_CLASSNAME} ol) {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
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
    `;
    const p = css`
      p:not(${IGNORE_CLASSNAME} kbd) {
        margin-block: 4px;
        line-height: var(--lobe-markdown-line-height);
        letter-spacing: 0.02em;

        &:not(:first-child) {
          margin-block-start: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        }

        &:not(:last-child) {
          margin-block-end: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        }
      }
    `;
    const pre = css`
      pre {
        font-size: calc(var(--lobe-markdown-font-size) * 0.85);
      }
    `;
    const strong = css`
      strong:not(${IGNORE_CLASSNAME} strong) {
        font-weight: 600;
      }
    `;
    const svg = css`
      svg:not(${IGNORE_CLASSNAME} svg) {
        line-height: 1;
      }
    `;
    const table = css`
      table:not(${IGNORE_CLASSNAME} table) {
        unicode-bidi: isolate;
        overflow: auto hidden;
        display: block;
        border-spacing: 0;
        border-collapse: collapse;

        box-sizing: border-box;
        width: max-content;
        max-width: 100%;
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        border-radius: calc(var(--lobe-markdown-border-radius) * 1px);

        text-align: start;
        text-indent: initial;
        text-wrap: pretty;
        word-break: auto-phrase;
        overflow-wrap: break-word;

        background: ${token.colorFillQuaternary};
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
    `;
    const video = css`
      > video:not(${IGNORE_CLASSNAME} video),
      > p:not(${IGNORE_CLASSNAME} p) > video {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
        border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
        box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
      }

      video:not(${IGNORE_CLASSNAME} video) {
        max-width: 100%;
      }
    `;

    const gfm = css`
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
    `;

    return {
      root: __root,
      variant: cx(
        a,
        blockquote,
        code,
        details,
        header,
        hr,
        img,
        kbd,
        list,
        p,
        pre,
        strong,
        svg,
        table,
        video,
        gfm,
      ),
    };
  },
);
