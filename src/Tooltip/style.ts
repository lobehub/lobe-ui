import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    arrow: css`
      fill: ${token.colorText};
    `,
    content: css`
      display: flex;
      align-items: center;
      justify-content: center;

      min-height: unset;
      padding: 8px;
      border-radius: ${token.borderRadiusSM}px;

      color: ${token.colorBgLayout};
      word-break: normal;

      background-color: ${token.colorText};
    `,
    tooltip: css`
      pointer-events: none;

      /* Keep the class name for backwards compatibility and user overrides */
      position: relative;
      z-index: 114514;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 12%));
    `,
    tooltipLayout: css`
      transition: all 0.2s ease-in-out;
    `,
  };
});
