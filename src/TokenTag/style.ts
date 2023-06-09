import { createStyles } from 'antd-style';

const HEIGHT = 28;
export const ICON_SIZE = 20;

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
        user-select: none;

        overflow: hidden;
        display: flex;
        gap: 4px;
        align-items: center;

        height: ${HEIGHT}px;
        padding: 0 ${(HEIGHT - ICON_SIZE) * 1.2}px 0 ${(HEIGHT - ICON_SIZE) / 2}px;

        font-family: ${token.fontFamilyCode};

        background: ${token.colorFillSecondary};
        border-radius: ${HEIGHT / 2}px;
      `,
    ),
  };
});
