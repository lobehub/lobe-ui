import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  (
    { css, token, cx },
    {
      minSize,
      size,
    }: {
      alwaysShowActions?: boolean;
      minSize?: number | string;
      objectFit?: string;
      size?: number | string;
    } = {},
  ) => {
    const SIZE = typeof size === 'number' ? `${size}px` : size;
    const MIN_SIZE = typeof minSize === 'number' ? `${minSize}px` : minSize;

    const preview = cx(css`
      pointer-events: none;

      position: absolute;
      z-index: 1;
      inset: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
      background: rgba(0, 0, 0, 50%);

      transition: opacity 0.3s;
    `);

    return {
      preview,
      video: css`
        cursor: pointer;
        width: 100%;
      `,
      videoWrapper: css`
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
          .${preview} {
            opacity: 1;
          }
        }
      `,
    };
  },
);
