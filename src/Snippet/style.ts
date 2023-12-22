import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, token, prefixCls }, type: 'ghost' | 'block') => {
  const typeStylish = css`
    background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
    border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};
  `;

  return {
    container: cx(
      typeStylish,
      css`
        position: relative;

        overflow: hidden;

        max-width: 100%;
        height: 38px;
        padding: 0 8px 0 12px;

        border-radius: ${token.borderRadius}px;

        transition: background-color 100ms ${token.motionEaseOut};

        &:hover {
          background-color: ${token.colorFillTertiary};
        }

        .${prefixCls}-highlighter-shiki {
          position: relative;
          overflow: hidden;
          flex: 1;
        }

        .prism-code {
          background: none !important;
        }

        pre {
          overflow-x: auto !important;
          overflow-y: hidden !important;
          display: flex;
          align-items: center;

          width: 100%;
          height: 36px !important;
          margin: 0 !important;

          line-height: 1;

          background: none !important;
        }

        code[class*='language-'] {
          background: none !important;
        }
      `,
    ),
  };
});
