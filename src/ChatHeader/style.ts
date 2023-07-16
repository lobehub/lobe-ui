import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      grid-area: header;
      height: 64px;
      border-bottom: 1px solid ${token.colorSplit};
    `,
  };
});
