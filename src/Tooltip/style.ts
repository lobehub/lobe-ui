import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    tooltip: css`
      .ant-tooltip-inner {
        display: flex;
        align-items: center;
        justify-content: center;

        min-height: unset;
        padding: 4px 8px;

        color: ${token.colorBgLayout};

        background-color: ${token.colorText};
        border-radius: ${token.borderRadiusSM}px;
      }

      .ant-tooltip-arrow {
        &::before,
        &::after {
          background: ${token.colorText};
        }
      }
    `,
  };
});
