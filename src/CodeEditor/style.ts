import { createStyles } from 'antd-style';
import { isNumber } from 'lodash-es';

export const useStyles = createStyles(
  (
    { cx, css, token },
    { variant, fontSize }: { fontSize: string | number; variant: 'ghost' | 'block' | 'pure' },
  ) => {
    const size = isNumber(fontSize) ? `${fontSize}px` : fontSize;
    const typeStylish = css`
      padding-block: 8px;
      padding-inline: 12px;

      background-color: ${variant === 'block' ? token.colorFillTertiary : 'transparent'};
      border: 1px solid ${variant === 'block' ? 'transparent' : token.colorBorderSecondary};
      border-radius: ${token.borderRadius}px;
    `;
    return {
      container: cx(
        variant !== 'pure' && typeStylish,
        css`
          position: relative;
          overflow: hidden auto;
          width: 100%;
        `,
      ),

      editor: css`
        position: relative;
        width: 100%;
        height: fit-content;

        * {
          font-family: ${token.fontFamilyCode} !important;
          font-size: ${size} !important;
          line-height: 1.5 !important;
          word-break: break-all !important;
          word-wrap: break-word !important;
          white-space: pre-wrap !important;
        }
      `,
      highlight: css`
        pointer-events: none;

        pre,
        code {
          overflow: hidden;
        }
      `,
      textarea: css`
        resize: none;

        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;

        overflow: hidden;

        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 0;

        color: transparent !important;
        text-align: start;

        background: transparent;
        border: none;
        outline: none;
        caret-color: ${token.colorText};

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
