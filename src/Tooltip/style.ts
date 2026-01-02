import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    arrow: css`
      fill: ${cssVar.colorText};
    `,
    content: css`
      position: relative;

      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      min-height: unset;
      padding-block: 6px;
      padding-inline: 10px;
      border-radius: ${cssVar.borderRadiusSM};

      color: ${cssVar.colorBgLayout};
      word-break: normal;

      background-color: ${cssVar.colorTextBase};
    `,

    tooltip: css`
      user-select: none;

      /* Keep the class name for backwards compatibility and user overrides */
      position: relative;
      z-index: 114514;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 12%));
    `,
    tooltipLayout: css`
      transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    `,
  };
});
