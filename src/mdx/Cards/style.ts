import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css }) => {
  return {
    container: css`
      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);

      > div {
        margin: 0 !important;
      }
    `,
  };
});
