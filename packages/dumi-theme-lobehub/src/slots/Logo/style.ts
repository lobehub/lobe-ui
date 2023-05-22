import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, responsive, token }) => css`
    display: inline-flex;
    align-items: center;
    color: ${token.colorText};
    font-size: 22px;
    line-height: 1;
    font-weight: 500;
    text-decoration: none;

    ${responsive.mobile} {
      font-size: 18px;
    }
  `,
);
