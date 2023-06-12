import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, token, stylish, cx },
    { direction, type }: { direction: 'row' | 'column'; type: 'ghost' | 'block' | 'pure' },
  ) => {
    const typeStylish = css`
      background-color: ${type === 'block' ? token.colorFillTertiary : token.colorFillQuaternary};
      border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};
    `;

    return {
      container: cx(
        type !== 'pure' && typeStylish,
        stylish.blur,
        css`
          position: relative;

          display: flex;
          flex-direction: ${direction};

          padding: 2px;

          border-radius: ${token.borderRadius}px;
        `,
      ),
    };
  },
);
