import { createStyles } from 'antd-style';
import { isNumber } from 'lodash-es';

export const useStyles = createStyles(
  (
    { cx, css, token },
    {
      type,
      resize,
      fontSize,
    }: { fontSize: string | number; resize: boolean; type: 'ghost' | 'block' | 'pure' },
  ) => {
    const size = isNumber(fontSize) ? `${fontSize}px` : fontSize;
    const typeStylish = css`
      padding-block: 8px;
      padding-inline: 12px;

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
          overflow: hidden auto;
          width: 100%;
          height: fit-content;

          * {
            font-size: ${size} !important;
            line-height: 1.5 !important;
          }
        `,
      ),
      editor: css`
        resize: ${resize ? 'vertical' : 'none'};
        height: fit-content;
        min-height: 100%;
        font-family: ${token.fontFamilyCode} !important;

        textarea {
          min-height: 36px !important;
        }

        pre {
          min-height: 36px !important;
          word-break: break-all;
          word-wrap: break-word;
          white-space: pre-wrap;

          &.shiki {
            margin: 0;
          }
        }
      `,
      textarea: css`
        overflow: hidden auto;

        height: 100% !important;

        color: transparent !important;
        word-break: break-all !important;
        word-wrap: break-word !important;

        caret-color: ${token.colorText};

        -webkit-text-fill-color: unset !important;

        &::placeholder {
          color: ${token.colorTextQuaternary};
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
