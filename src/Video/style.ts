import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  (
    { css, token, cx },
    {
      minSize,
      size,
    }: {
      minSize?: number | string;
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
      height: auto;

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

        width: 100%;
        min-width: ${MIN_SIZE};
        max-width: ${SIZE};
        height: auto;
        min-height: ${MIN_SIZE};
        max-height: ${SIZE};
        margin-block: 0 1em;

        background: ${rgba(token.colorBgLayout, 0.25)};
        border-radius: ${token.borderRadiusLG}px;
        box-shadow: inset 0 0 0 1px ${token.colorBorderSecondary};

        &:hover {
          .${preview} {
            opacity: 1;
          }
        }
      `,
    };
  },
);
