import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);

      > div {
        margin: 0 !important;
      }
    `,
  };
});
