import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, token, cx, stylish },
    {
      maxHeight,
      maxWidth,
      minWidth,
      minHeight,
    }: {
      maxHeight?: number | string;
      maxWidth?: number | string;
      minHeight?: number | string;
      minWidth?: number | string;
    } = {},
  ) => {
    const MAX_HEIGHT = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    const MAX_WIDTH = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
    const MIN_HEIGHT = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
    const MIN_WIDTH = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;

    const mask = cx(css`
      pointer-events: none;

      position: absolute;
      z-index: 1;
      inset: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
      background: ${token.colorBgMask};

      transition: opacity 0.3s;
    `);

    return {
      borderless: stylish.variantBorderlessWithoutHover,
      filled: stylish.variantFilledWithoutHover,
      mask,
      outlined: stylish.variantOutlinedWithoutHover,
      root: css`
        position: relative;

        overflow: hidden;

        width: 100%;
        min-width: ${MIN_WIDTH};
        max-width: ${MAX_WIDTH};
        height: auto;
        min-height: ${MIN_HEIGHT};
        max-height: ${MAX_HEIGHT};
        margin-block: 0 1em;

        background: ${token.colorFillTertiary};
        border-radius: ${token.borderRadius}px;

        &:hover {
          .${mask} {
            opacity: 1;
          }
        }
      `,
      video: css`
        cursor: pointer;
        width: 100%;
      `,
    };
  },
);
