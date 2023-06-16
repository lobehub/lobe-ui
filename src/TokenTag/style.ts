import { createStyles } from 'antd-style';

const HEIGHT = 28;
const ICON_SIZE = 20;

export const useStyles = createStyles(({ cx, css, token }, type: 'normal' | 'low' | 'overload') => {
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

  return {
    container: cx(
      percentStyle,
      css`
        overflow: hidden;
        display: flex;
        gap: 4px;
        align-items: center;

        height: ${HEIGHT}px;
        padding: 0 ${HEIGHT - ICON_SIZE}px 0 ${(HEIGHT - ICON_SIZE) / 2}px;

        background: ${token.colorFillSecondary};
        border-radius: ${HEIGHT / 2}px;
      `,
    ),
    emoji: css`
      font-size: ${ICON_SIZE}px;
    `,
  };
});
