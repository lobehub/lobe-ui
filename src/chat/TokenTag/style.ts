import { createStyles } from 'antd-style';

const HEIGHT = 28;
export const ICON_SIZE = 20;

export const useStyles = createStyles(
  (
    { cx, css, token, isDarkMode },
    { type, shape }: { shape: 'round' | 'square'; type: 'normal' | 'low' | 'overload' },
  ) => {
    let percentStyle;

    switch (type) {
      case 'normal': {
        percentStyle = css`
          color: ${token.colorSuccessText};
        `;
        break;
      }
      case 'low': {
        percentStyle = css`
          color: ${token.colorWarningText};
        `;
        break;
      }
      case 'overload': {
        percentStyle = css`
          color: ${token.colorErrorText};
        `;
        break;
      }
    }

    const roundStylish = css`
      padding-block: 0;
      padding-inline: ${(HEIGHT - ICON_SIZE) / 2}px ${(HEIGHT - ICON_SIZE) * 1.2}px;
      background: ${isDarkMode ? token.colorFillSecondary : token.colorFillTertiary};
      border-radius: ${HEIGHT / 2}px;
    `;

    const squareStylish = css`
      border-radius: ${token.borderRadiusSM}px;
    `;

    return {
      container: cx(
        percentStyle,
        shape === 'round' ? roundStylish : squareStylish,
        css`
          user-select: none;

          overflow: hidden;

          min-width: fit-content;
          height: ${HEIGHT}px;

          font-size: 13px;
          line-height: 1;
        `,
      ),
    };
  },
);
