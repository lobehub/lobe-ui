import { GetCustomStylish, keyframes } from 'antd-style';

import { LobeCustomStylish } from '@/types/customStylish';

export const generateCustomStylish: GetCustomStylish<LobeCustomStylish> = ({
  css,
  token,
  isDarkMode,
}) => {
  const gradient = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `;

  return {
    blur: css`
      backdrop-filter: saturate(180%) blur(10px);
    `,
    blurStrong: css`
      backdrop-filter: blur(36px);
    `,
    bottomScrollbar: css`
      ::-webkit-scrollbar {
        width: 0;
        height: 4px;
        background-color: transparent;

        &-thumb {
          background-color: ${token.colorFill};
          border-radius: 4px;
          transition: background-color 500ms ${token.motionEaseOut};
        }

        &-corner {
          display: none;
          width: 0;
          height: 0;
        }
      }
    `,
    gradientAnimation: css`
      background-image: linear-gradient(
        -45deg,
        ${token.gold},
        ${token.magenta},
        ${token.geekblue},
        ${token.cyan}
      );
      background-size: 400% 400%;
      border-radius: inherit;
      animation: 5s ${gradient} 5s ease infinite;
    `,
    markdown: css`
      --lobe-markdown-font-size: 16px;
      --lobe-markdown-header-multiple: 1;

      position: relative;

      width: 100%;

      font-size: var(--lobe-markdown-font-size);
      line-height: 1.6;
      word-break: break-word;

      h1,
      h2,
      h3,
      h4,
      h5 {
        margin-block: max(
          calc(var(--lobe-markdown-header-multiple) * 1em),
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

      ul,
      ol {
        margin-block-end: 1em;
        margin-inline-start: 1em;
        padding-inline-start: 1em;
        padding-inline-start: 0;

        list-style-position: outside;

        li {
          margin-inline-start: 1em;
        }
      }

      ol {
        li {
          &::marker {
            color: ${token.colorTextSecondary};
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
            color: ${token.colorTextDescription};
          }
        }
      }

      strong {
        font-weight: 600;
      }

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
        border-radius: ${token.borderRadius}px;
      }

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

      blockquote {
        margin-block: 1em;
        margin-inline: 0;
        padding-block: 0;
        padding-inline: 1em;

        color: ${token.colorTextSecondary};

        border-inline-start: solid 4px ${token.colorBorder};
      }

      hr {
        margin-block: 1em;

        border-color: ${token.colorBorderSecondary};
        border-style: dashed;
        border-width: 1px;
        border-block-start: none;
        border-inline-start: none;
        border-inline-end: none;
      }

      details {
        margin-block: 1em;
        padding-block: 0.75em;
        padding-inline: 1em;

        background: ${token.colorFillTertiary};
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadius}px;

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

      img,
      video {
        max-width: 100%;
      }

      table {
        overflow: hidden;
        display: table;
        border-spacing: 0;
        border-collapse: collapse;

        box-sizing: border-box;
        width: 100%;
        margin-block: 1em;

        text-align: start;
        overflow-wrap: break-word;

        background: ${token.colorFillTertiary};
        border-radius: ${token.borderRadius}px;
        box-shadow: inset 0 0 0 1px ${token.colorBorderSecondary};
      }

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
      }

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
    markdownInChat: css`
      margin-block: -0.75em;
    `,
    noScrollbar: css`
      ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        background-color: transparent;
      }
    `,
    resetLinkColor: css`
      cursor: pointer;
      color: ${token.colorTextSecondary};

      &:hover {
        color: ${token.colorText};
      }
    `,
  };
};
