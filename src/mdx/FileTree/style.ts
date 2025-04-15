import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      padding-block: 0.75em;
      padding-inline: 1em;

      color: ${token.colorTextSecondary};

      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
      box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
    `,
  };
});
