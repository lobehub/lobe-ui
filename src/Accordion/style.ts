import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    action: css`
      width: 0;
      opacity: 0;
      transition:
        opacity,
        width 0.2s ${token.motionEaseOut};
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
        border-radius: ${token.borderRadiusLG}px;
        outline: 2px solid ${token.colorPrimary};
        outline-offset: 2px;
      }
    `,
    icon: css`
      color: ${token.colorTextDescription};
      transition: transform 200ms ${token.motionEaseOut};
    `,
    iconRotate: css`
      transform: rotate(90deg);
    `,
    indicator: css`
      display: flex;
      flex-shrink: 0;
      align-items: center;

      font-size: 18px;

      transition: transform 200ms ${token.motionEaseOut};
    `,
    item: css`
      position: relative;
      display: flex;
      flex-direction: column;
    `,
  };
});
