import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token, cx, stylish, isDarkMode }) => {
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
        padding-bottom: 12px;

        background: ${rgba(isDarkMode ? token.colorBgLayout : token.colorBgContainer, 0.5)};
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
      color: ${token.colorTextSecondary};
    `,
    title: css`
      overflow: hidden;

      width: 100%;

      font-size: 12px;
      line-height: 1;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
  };
});
