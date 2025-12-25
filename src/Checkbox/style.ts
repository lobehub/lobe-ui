import { createStyles } from 'antd-style';
import { readableColor } from 'polished';

export const useStyles = createStyles(({ css, token }) => {
  return {
    checked: css`
      border-color: ${token.colorPrimary};
      color: ${readableColor(token.colorPrimary)};
      background-color: ${token.colorPrimary};
    `,
    root: css`
      cursor: pointer;
      display: inline-flex;
    `,
  };
});
