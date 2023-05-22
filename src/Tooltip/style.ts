import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    tooltip: css`
      .ant-tooltip-inner {
        background-color: ${token.colorText};
        color: ${token.colorBgLayout};
        padding: 4px 8px;
        border-radius: ${token.borderRadiusSM}px;
        min-height: unset;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ant-tooltip-arrow {
        &:before,
        &:after {
          background: ${token.colorText};
        }
      }
    `,
  };
});
