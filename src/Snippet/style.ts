import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }, type: 'ghost' | 'block') =>
    css`
      display: flex;

      align-items: center;
      border-radius: ${token.borderRadiusLG}px;
      gap: 8px;
      padding: 8px 16px;
      transition:  background-color 100ms ${token.motionEaseOut};

      ${
        type === 'block'
          ? css`
              background-color: rgba(token.colorBgElevated, 0.6);
            `
          : css`
              border: 1px solid ${token.colorBorder};
            `
      }

      &:hover {
        background-color: ${token.colorFillTertiary};
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
