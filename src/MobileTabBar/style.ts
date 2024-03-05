import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token }) => {
  return {
    active: css`
      color: ${token.colorPrimary};
    `,
    container: css`
      overflow: hidden;
      flex: none;
      user-select: none;

      width: 100vw;

      background: ${token.colorBgLayout};
      border-block-start: 1px solid ${rgba(token.colorBorder, 0.25)};
    `,

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
      color: ${token.colorTextSecondary};
    `,
    title: css`
      overflow: hidden;

      width: 100%;

      font-size: 12px;
      line-height: 1.125em;
      margin-top: -0.125em;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
  };
});
