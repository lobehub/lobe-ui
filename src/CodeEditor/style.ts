import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, css, token, isDarkMode },
    { type, resize }: { resize: boolean; type: 'ghost' | 'block' | 'pure' },
  ) => {
    const typeStylish = css`
      padding: 8px 12px;

      background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
      border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorderSecondary};
      border-radius: ${token.borderRadius}px;

      transition:
        background-color 100ms ${token.motionEaseOut},
        border-color 200ms ${token.motionEaseOut};

      &:hover {
        background-color: ${type === 'block'
          ? token.colorFillSecondary
          : token.colorFillQuaternary};
        border-color: ${token.colorBorder};
      }
    `;
    return {
      container: cx(
        type !== 'pure' && typeStylish,
        css`
          overflow-x: hidden;
          overflow-y: auto;
          height: fit-content;
        `,
      ),
      editor: css`
        resize: ${resize ? 'vertical' : 'none'};
        height: fit-content;
        font-family: ${token.fontFamilyCode} !important;

        pre {
          word-wrap: break-word;
          white-space: pre-wrap;

          &.shiki {
            margin: 0;
          }
        }
      `,
      textarea: css`
        overflow-x: hidden;
        overflow-y: auto;
        height: 100% !important;

        &::placeholder {
          color: ${token.colorTextQuaternary};
        }

        &::selection {
          color: #000;
          background: ${isDarkMode ? token.yellow3A : token.yellow6A};
        }

        &:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `,
    };
  },
);
