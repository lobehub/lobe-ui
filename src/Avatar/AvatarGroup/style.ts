import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, stylish, css, token, prefixCls }) => {
  return {
    avatar: css`
      box-shadow: 0 0 0 2px ${token.colorBgLayout};

      &:hover {
        transform: translateY(-10%);
      }
    `,
    count: cx(
      stylish.blur,
      css`
        &.${prefixCls}-avatar {
          background: ${token.colorFill};
          > .${prefixCls}-avatar-string {
            transform: scale(0.8) !important;
          }
        }
      `,
    ),
  };
});
