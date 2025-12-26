import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    arrow: css`
      fill: ${cssVar.colorText};
    `,
    content: css`
      display: flex;
      align-items: center;
      justify-content: center;

      min-height: unset;
      padding: 8px;
      border-radius: ${cssVar.borderRadiusSM};

      color: ${cssVar.colorBgLayout};
      word-break: normal;

      background-color: ${cssVar.colorText};
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
