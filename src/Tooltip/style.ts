import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    tooltip: css`
      .${prefixCls}-tooltip-inner {
        display: flex;
        align-items: center;
        justify-content: center;

        min-height: unset;
        padding-block: 4px;
        padding-inline: 8px;

        color: ${token.colorBgLayout};
        word-break: normal;

        background-color: ${token.colorText};
        border-radius: ${token.borderRadiusSM}px;
      }

      .${prefixCls}-tooltip-arrow {
        &::before,
        &::after {
          background: ${token.colorText};
        }
      }
    `,
  };
});
