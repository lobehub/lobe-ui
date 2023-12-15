import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  (
    { css, token, cx, stylish },
    {
      minSize,
      size,
      alwaysShowActions,
      objectFit,
    }: {
      alwaysShowActions?: boolean;
      minSize?: number | string;
      objectFit?: string;
      size?: number | string;
    } = {},
  ) => {
    const SIZE = typeof size === 'number' ? `${size}px` : size;
    const MIN_SIZE = typeof minSize === 'number' ? `${minSize}px` : minSize;

    const actions = cx(css`
      cursor: pointer;

      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;

      opacity: ${alwaysShowActions ? 1 : 0};
    `);

    return {
      actions,
      image: css`
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;

        img {
          width: ${SIZE} !important;
          min-width: ${MIN_SIZE} !important;
          height: ${SIZE} !important;
          min-height: ${MIN_SIZE} !important;

          object-fit: ${objectFit || 'cover'};
        }
      `,
      imageWrapper: css`
        position: relative;

        overflow: hidden;

        width: ${SIZE};
        min-width: ${MIN_SIZE};
        height: ${SIZE};
        min-height: ${MIN_SIZE};
        margin-block: 0 1em;

        background: ${rgba(token.colorBgLayout, 0.25)};
        border-radius: ${token.borderRadius}px;
        box-shadow: 0 0 0 1px ${token.colorFillTertiary};

        &:hover {
          .${actions} {
            opacity: 1;
          }
        }
      `,

      toolbar: cx(
        stylish.blur,
        css`
          padding: 4px;
          background: ${rgba(token.colorBgMask, 0.1)};
          border-radius: ${token.borderRadiusLG}px;
        `,
      ),
    };
  },
);
