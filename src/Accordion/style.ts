import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    action: css`
      width: 0;
      opacity: 0;
      transition:
        opacity,
        width 0.2s ${cssVar.motionEaseOut};
    `,
    base: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
    content: css`
      overflow: hidden;
    `,
    contentInner: css`
      /* Content wrapper for animation */
    `,
    divider: css`
      margin-block: 0;
    `,
    header: css`
      &:hover .accordion-action {
        width: auto;
        opacity: 1;
      }

      &:focus-visible {
        border-radius: ${cssVar.borderRadiusLG};
        outline: 2px solid ${cssVar.colorPrimary};
        outline-offset: 2px;
      }
    `,
    icon: css`
      transition: transform 200ms ${cssVar.motionEaseOut};
    `,
    iconRotate: css`
      transform: rotate(90deg);
    `,
    indicator: css`
      display: flex;
      flex-shrink: 0;
      align-items: center;

      font-size: 18px;
      color: ${cssVar.colorTextDescription};

      transition: transform 200ms ${cssVar.motionEaseOut};
    `,
    item: css`
      position: relative;
      display: flex;
      flex-direction: column;
    `,
    titleWrapper: css`
      user-select: none;
    `,
  };
});
