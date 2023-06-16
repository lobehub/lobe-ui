import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, responsive: r, stylish }) => ({
  desc: css`
    font-size: ${token.fontSizeLG}px;
    line-height: ${token.lineHeightLG}px;
  `,
  label: css`
    width: 80px;
  `,
  meta: css``,
  text: css`
    ${stylish.resetLinkColor}
  `,
  title: css`
    ${r.mobile} {
      margin-block: 0;
      font-size: 32px !important;
    }
  `,
}));
