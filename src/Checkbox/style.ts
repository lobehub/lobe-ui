import { createStyles } from 'antd-style';
import { readableColor } from 'polished';

export const useStyles = createStyles(({ css, token }) => {
  return {
    checked: css`
      border-color: ${token.colorPrimary};
      color: ${readableColor(token.colorPrimary)};
      background-color: ${token.colorPrimary};
    `,
    disabled: css`
      cursor: not-allowed;

      border-color: ${token.colorFill};

      color: ${readableColor(token.colorTextQuaternary)};

      opacity: 0.25;
      background-color: ${token.colorFill};
    `,
    indeterminate: css`
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
