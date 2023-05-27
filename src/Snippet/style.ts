import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }, type: 'ghost' | 'block') =>
    css`
      position: relative;

      display: flex;
      gap: 8px;
      align-items: center;

      max-width: 100%;
      height: 36px;
      padding: 0 8px 0 12px;

      border-radius: ${token.borderRadius}px;

      transition: background-color 100ms ${token.motionEaseOut};
      ${type === 'block'
        ? css`
            background-color: ${token.colorFillTertiary};
          `
        : css`
            border: 1px solid ${token.colorBorder};
          `}

      &:hover {
        background-color: ${token.colorFillTertiary};
      }

      .ant-highlighter-shiki {
        overflow: auto;
        flex: 1;
      }
      .prism-code {
        background: none !important;
      }

      pre {
        margin: 0 !important;
        padding-top: 6px !important;
        line-height: 1;
        background: none !important;
      }

      code[class*='language-'] {
        background: none !important;
      }
    `,
);
