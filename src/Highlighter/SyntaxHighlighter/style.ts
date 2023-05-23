import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, cx, prefixCls }) => {
  const prefix = `${prefixCls}-highlighter`;

  return {
    shiki: cx(
      `${prefix}-shiki`,
      css`
        .shiki {
          overflow-x: scroll;

          .line {
            font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
          }
        }
      `,
    ),
    prism: css`
      pre {
        overflow-x: scroll;
      }
    `,

    loading: css`
      position: absolute;
      top: 0;
      right: 0;
      color: ${token.colorTextTertiary};
      padding: 4px 8px;
      backdrop-filter: saturate(180%) blur(10px);
      border-radius: ${token.borderRadiusSM};
    `,
  };
});
