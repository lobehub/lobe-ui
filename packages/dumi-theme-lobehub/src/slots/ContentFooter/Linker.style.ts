import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    background: ${token.colorBgContainer};
    padding: 16px 24px;
    border-radius: 8px;
    cursor: pointer;

    min-width: 250px;
    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  nav: css`
    color: ${token.colorTextTertiary};
    font-size: 12px;
  `,
  title: css`
    font-size: 16px;
  `,

  alignmentEnd: css`
    justify-content: flex-end;
  `,
}));
