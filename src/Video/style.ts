import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, token, cx },
    {
      minSize,
      size,
      borderless,
    }: {
      borderless?: boolean;
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
      videoWrapper: cx(
        borderless
          ? css`
              box-shadow: inset 0 0 0 1px ${token.colorBorderSecondary};
            `
          : css`
              box-shadow: 0 0 0 1px ${token.colorBorderSecondary};
            `,
        css`
          position: relative;

          overflow: hidden;

          width: 100%;
          min-width: ${MIN_SIZE};
          max-width: ${SIZE};
          height: auto;
          min-height: ${MIN_SIZE};
          max-height: ${SIZE};
          margin-block: 0 1em;

          background: ${token.colorFillTertiary};
          border-radius: ${token.borderRadiusLG}px;

          &:hover {
            .${preview} {
              opacity: 1;
            }
          }
        `,
      ),
    };
  },
);
