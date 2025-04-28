import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  (
    { cx, css, token, stylish, prefixCls },
    {
      maxHeight,
      maxWidth,
      minWidth,
      minHeight,
      alwaysShowActions,
      objectFit,
    }: {
      alwaysShowActions?: boolean;
      maxHeight?: number | string;
      maxWidth?: number | string;
      minHeight?: number | string;
      minWidth?: number | string;
      objectFit?: string;
    } = {},
  ) => {
    const MAX_HEIGHT = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    const MAX_WIDTH = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
    const MIN_HEIGHT = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
    const MIN_WIDTH = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;

    const actions = cx(css`
      cursor: pointer;

      position: absolute;
      z-index: 1;
      inset-block-start: 0;
      inset-inline-end: 0;

      opacity: ${alwaysShowActions ? 1 : 0};
    `);

    return {
      actions,
      borderless: stylish.variantBorderlessWithoutHover,
      filled: cx(stylish.variantOutlinedWithoutHover, stylish.variantFilledWithoutHover),
      image: css`
        position: relative;
        overflow: hidden;
        width: 100%;
        height: auto;

        .${prefixCls}-image-img {
          width: 100%;
          min-width: ${MIN_WIDTH};
          max-width: ${MAX_WIDTH};
          height: auto;
          min-height: ${MIN_HEIGHT};
          max-height: ${MAX_HEIGHT};

          object-fit: ${objectFit || 'cover'};
        }
      `,
      mask: cx(
        stylish.blur,
        css`
          backdrop-filter: blur(8px);
        `,
      ),
      outlined: stylish.variantOutlinedWithoutHover,
      preview: css`
        img {
          width: 100%;
        }
      `,
      root: css`
        cursor: pointer;
        user-select: none;

        position: relative;

        overflow: hidden;

        border-radius: ${token.borderRadius}px;

        &:hover {
          .${actions} {
            opacity: 1;
          }
        }
      `,

      toolbar: cx(
        stylish.blur,
        stylish.variantOutlinedWithoutHover,
        css`
          padding: 4px;
          background: ${rgba(token.colorBgMask, 0.5)};
          border-radius: ${token.borderRadiusLG}px;
        `,
      ),
    };
  },
);
