import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    avatar: css`
      box-shadow: 0 0 0 2px ${token.colorBgLayout};

      &:hover {
        transform: translateY(-10%);
      }
    `,
    count: css`
      &.${prefixCls}-avatar {
        background: ${token.colorText};
        > .${prefixCls}-avatar-string {
          transform: scale(0.8) !important;
          color: ${token.colorBgLayout};
        }
      }
    `,
  };
});
