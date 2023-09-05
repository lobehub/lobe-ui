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

  const cyanColor = isDarkMode ? token.cyan9A : token.cyan11A;
  const cyanBackground = isDarkMode ? token.cyan2A : token.cyan6A;

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
      color: ${isDarkMode ? token.colorTextSecondary : token.colorText};

      h1,
      h2,
      h3,
      h4,
      h5 {
        font-weight: 600;
      }

      p {
        margin-block-start: 0;
        margin-block-end: 0;

        font-size: 14px;
        line-height: 1.8;
        color: ${token.colorText};
        text-align: justify;
        word-break: break-all;
        word-wrap: break-word;

        + * {
          margin-block-end: 0.5em;
        }
      }

      > *:last-child {
        margin-bottom: 0 !important;
      }

      blockquote {
        margin: 16px 0;
        padding: 0 12px;

        p {
          font-style: italic;
          color: ${token.colorTextDescription};
        }
      }

      p:not(:last-child) {
        margin-bottom: 1em;
      }

      a {
        color: ${token.colorLink};

        &:hover {
          color: ${token.colorLinkHover};
        }

        &:active {
          color: ${token.colorLinkActive};
        }
      }

      img {
        max-width: 100%;
      }

      pre,
      [data-code-type='highlighter'] {
        border: none;
        border-radius: ${token.borderRadius}px;

        > code {
          padding: 0 !important;
          border: none !important;
        }
      }

      > :not([data-code-type='highlighter']) code {
        padding: 2px 6px;

        font-size: ${token.fontSizeSM}px;
        color: ${cyanColor};

        background: ${cyanBackground};
        border: 1px solid ${isDarkMode ? token.cyan1A : token.cyan6A};
        border-radius: ${token.borderRadiusSM}px;
      }

      table {
        border-spacing: 0;

        width: 100%;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0;
        margin-inline-end: 0;
        padding: 8px;

        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadius}px;
      }

      th,
      td {
        padding-block-start: 10px;
        padding-block-end: 10px;
        padding-inline-start: 16px;
        padding-inline-end: 16px;
      }

      thead {
        tr {
          th {
            background: ${token.colorFillTertiary};

            &:first-child {
              border-top-left-radius: ${token.borderRadius}px;
              border-bottom-left-radius: ${token.borderRadius}px;
            }

            &:last-child {
              border-top-right-radius: ${token.borderRadius}px;
              border-bottom-right-radius: ${token.borderRadius}px;
            }
          }
        }
      }

      > ol > li {
        margin-left: 0;
      }

      ol {
        counter-reset: steps;
        margin-left: 0;
        list-style: none;

        li {
          counter-increment: steps;
          word-break: break-all;

          &::before {
            content: counter(steps);

            scale: 0.8;

            unicode-bidi: isolate;
            display: inline-flex !important;
            align-items: center;
            justify-content: center;

            width: 1.4em;
            min-width: 1.4em;
            max-width: 1.4em;
            height: 1.4em;
            margin-right: 0.5em;

            font-family: ${token.fontFamilyCode};
            font-size: 1em;
            line-height: 1;
            color: ${cyanColor};

            background: ${cyanBackground};
            border-radius: 50%;
          }
        }

        ol li::before {
          color: ${token.colorTextSecondary};
          background: ${token.colorFill};
        }
      }

      ul {
        > li::marker {
          color: ${token.colorTextDescription};
        }
      }

      > ul {
        > li {
          line-height: 1.8;
          list-style-type: disc;

          &::marker {
            color: ${isDarkMode ? token.cyan9A : token.cyan10A} !important;
          }
        }
      }

      details {
        margin-bottom: 1em;
        padding: 12px 16px;

        background: ${token.colorFillTertiary};
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadiusLG}px;

        transition: all 400ms ${token.motionEaseOut};
      }

      details[open] {
        summary {
          padding-bottom: 12px;
          border-bottom: 1px solid ${token.colorBorder};
        }
      }
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
