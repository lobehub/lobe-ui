import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token, cx, stylish }) => {
  return {
    active: css`
      color: ${token.colorPrimary};
    `,
    container: cx(
      stylish.blur,
      css`
        overflow: hidden;
        flex: none;

        width: 100vw;

        background: ${rgba(token.colorBgContainer, 0.5)};
        border-top: 1px solid ${token.colorBorder};
      `,
    ),
    icon: css`
      width: 24px;
      height: 24px;
      font-size: 24px;
    `,
    inner: css`
      position: relative;
      width: 100%;
      height: 48px;
    `,
    tab: css`
      cursor: pointer;

      width: 48px;
      height: 48px;
      padding-top: env(safe-area-inset-top);

      color: ${token.colorTextSecondary};
    `,
    title: css`
      font-size: 12px;
      line-height: 1;
    `,
  };
});
