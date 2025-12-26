import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  return {
    body: css`
      padding-inline: 1em;

      > div {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      }
    `,
    container: css`
      /* Container styles */
    `,
    header: css`
      /* Header styles */
    `,
  };
});
