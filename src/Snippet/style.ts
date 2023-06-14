import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, token }, type: 'ghost' | 'block') => {
  const typeStylish = css`
    background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
    border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};
  `;

  return cx(
    typeStylish,
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
        line-height: 1;
        background: none !important;
      }

      code[class*='language-'] {
        background: none !important;
      }
    `,
  );
});
