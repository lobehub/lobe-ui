import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    container: css`
      --lobe-markdown-margin-multiple: 1;

      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      background: ${token.colorFillQuaternary};
      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
      box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
    `,

    header: css`
      border-block-end: 1px solid var(--lobe-markdown-border-color);
      .${prefixCls}-tabs-tab-btn {
        font-size: var(--lobe-markdown-font-size);
        line-height: var(--lobe-markdown-line-height);
      }
    `,
  };
});
