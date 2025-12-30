import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    avatar: css`
      border: 2px solid ${cssVar.colorBgContainer} !important;
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
