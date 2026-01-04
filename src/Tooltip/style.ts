import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    arrow: css`
      width: 12px;
      height: 6px;
      color: ${cssVar.colorText};

      svg {
        display: block;
        width: 100%;
        height: 100%;
        fill: currentColor;
        transform-origin: center;
      }

      &[data-side='top'] svg {
        transform: rotate(180deg);
      }

      &[data-side='left'] svg {
        transform: rotate(90deg);
      }

      &[data-side='right'] svg {
        transform: rotate(-90deg);
      }
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
    popup: css`
      transition:
        width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        height 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    `,
    positioner: css`
      transition:
        transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        top 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        right 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        bottom 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        left 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    `,

    tooltip: css`
      user-select: none;

      /* Keep the class name for backwards compatibility and user overrides */
      position: relative;
      z-index: 114514;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 12%));
    `,
    viewport: css`
      position: relative;
      overflow: hidden;

      display: block;

      &[data-activation-direction] [data-current],
      &[data-activation-direction] [data-previous] {
        display: block;
        transition:
          opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1),
          transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
      }

      &[data-activation-direction] [data-current] {
        opacity: 1;
      }

      &[data-activation-direction] [data-previous] {
        position: absolute;
        inset: 0;
        opacity: 0;
      }

      &[data-activation-direction='left'] [data-previous] {
        transform: translateX(-6px);
      }

      &[data-activation-direction='right'] [data-previous] {
        transform: translateX(6px);
      }

      &[data-activation-direction='up'] [data-previous] {
        transform: translateY(-6px);
      }

      &[data-activation-direction='down'] [data-previous] {
        transform: translateY(6px);
      }
    `,
  };
});
