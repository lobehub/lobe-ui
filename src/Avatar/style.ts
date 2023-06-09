import { createStyles } from 'antd-style';
import { readableColor } from 'polished';

export const useStyles = createStyles(
  ({ css, token }, { background, size }: { background?: string; size: number }) => {
    const backgroundColor = background ?? token.colorBgContainer;
    const color = readableColor(backgroundColor);

    return {
      avatar: css`
        cursor: pointer;

        font-size: ${size * 0.5}px;
        font-weight: 700;
        line-height: 1;
        color: ${color};

        background: ${backgroundColor};
        border: 1px solid ${background ? 'transparent' : token.colorSplit};

        > * {
          cursor: pointer;
        }
      `,
    };
  },
);
