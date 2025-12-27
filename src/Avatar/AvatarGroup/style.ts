import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    avatar: css`
      box-shadow: 0 0 0 2px ${cssVar.colorBgLayout};

      &:hover {
        transform: translateY(-10%);
      }
    `,
    count: css`
      &[class*='ant-avatar'] {
        background: ${cssVar.colorText};

        > [class*='ant-avatar-string'] {
          transform: scale(0.8) !important;
          color: ${cssVar.colorBgLayout};
        }
      }
    `,
  };
});
