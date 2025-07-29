import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    root: css`
      overflow: hidden;
      flex: none;

      /* Fallback for browsers without mask support */
      border-radius: 15%;

      /* Apply smooth corners mask with fallback */
      @supports (mask-image: url('data:image/svg+xml;base64,')) {
        border-radius: 0;

        /* The mask will be applied via inline style */
      }
    `,
  };
});
