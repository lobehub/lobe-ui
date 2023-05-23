import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  ({ css, token }, type: 'ghost' | 'block') =>
    css`
      display: flex;
      max-width: 100%;
      position: relative;
      align-items: center;
      border-radius: ${token.borderRadius}px;
      gap: 8px;
      padding: 0 8px;
      height: 36px;
      transition:  background-color 100ms ${token.motionEaseOut};

      ${
        type === 'block'
          ? css`
              background-color: ${rgba(token.colorBgElevated, 0.6)};
            `
          : css`
              border: 1px solid ${token.colorBorder};
            `
      }

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
        background: none !important;
        padding-top: 6px; !important;
        margin: 0 !important;
        line-height: 1;
      }
      code[class*='language-'] {
        background: none !important;
      }
    `,
);
