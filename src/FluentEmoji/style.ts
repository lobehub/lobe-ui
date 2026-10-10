import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css }) => {
  return {
    container: css`
      position: relative;
      line-height: 1;
      text-align: center;
    `,
  };
});
