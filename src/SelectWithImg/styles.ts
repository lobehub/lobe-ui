import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, cx }) => {
  const hover = css`
    &:hover {
      border-color: ${token.colorText};
      box-shadow: 0 0 0 2px ${token.colorText};
    }
  `;

  const img = cx(
    css`
      position: relative;
      overflow: hidden;
      border-radius: ${token.borderRadius}px;
      transition: all 100ms ${token.motionEaseOut};

      &::before {
        content: '';

        position: absolute;
        inset: 0;

        display: block;

        width: 100%;
        height: 100%;

        border-radius: inherit;
        box-shadow: inset 0 0 0 2px ${token.colorSplit};
      }
    `,
    hover,
  );

  return {
    active: css`
      color: ${token.colorText};
    `,
    container: css`
      cursor: pointer;
      color: ${token.colorTextDescription};
    `,
    img,
    imgActive: css`
      box-shadow: 0 0 0 2px ${token.colorTextTertiary};

      .${img}:before {
        box-shadow: none;
      }
    `,
    imgCtn: css`
      background: ${token.colorFillTertiary};
      border-radius: ${token.borderRadius}px;

      ${hover}
    `,
  };
});
