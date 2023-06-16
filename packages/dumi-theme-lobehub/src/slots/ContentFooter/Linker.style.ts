import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  alignmentEnd: css`
    justify-content: flex-end;
  `,
  container: css`
    cursor: pointer;

    min-width: 250px;
    padding: 16px 24px;

    background: ${token.colorBgContainer};
    border-radius: 8px;

    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  nav: css`
    font-size: 12px;
    color: ${token.colorTextTertiary};
  `,

  title: css`
    font-size: 16px;
  `,
}));
