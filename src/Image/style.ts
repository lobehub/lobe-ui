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
        max-width: 100%;
        height: auto;

        .${prefixCls}-image-img {
          width: auto;
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

        width: fit-content;
        border-radius: ${token.borderRadius}px;

        line-height: 1;

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
          border-color: ${token.colorFillTertiary};
          border-radius: ${token.borderRadiusLG}px;
          background: ${rgba(token.colorBgMask, 0.5)};
        `,
      ),
    };
  },
);

export const FALLBACK =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA2NDAgNDAwIj48cGF0aCBmaWxsPSIjM0IzQjNCIiBkPSJNMCAwaDY0MHY0MDBIMHoiLz48cGF0aCBzdHJva2U9IiM2MjYyNjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxNSIgZD0iTTM3Mi41IDEzMi41aC0xMDVjLTguMjg0IDAtMTUgNi43MTYtMTUgMTV2MTA1YzAgOC4yODQgNi43MTYgMTUgMTUgMTVoMTA1YzguMjg0IDAgMTUtNi43MTYgMTUtMTV2LTEwNWMwLTguMjg0LTYuNzE2LTE1LTE1LTE1eiIvPjxwYXRoIHN0cm9rZT0iIzYyNjI2MiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjE1IiBkPSJNMjk3LjUgMTkyLjVjOC4yODQgMCAxNS02LjcxNiAxNS0xNSAwLTguMjg0LTYuNzE2LTE1LTE1LTE1LTguMjg0IDAtMTUgNi43MTYtMTUgMTUgMCA4LjI4NCA2LjcxNiAxNSAxNSAxNXpNMzg3LjUgMjIyLjUwMmwtMjMuMTQ1LTIzLjE0NWExNS4wMDEgMTUuMDAxIDAgMDAtMjEuMjEgMEwyNzUgMjY3LjUwMiIvPjwvc3ZnPg==';
