import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token, stylish, cx }, { active, glass }: { active: boolean; glass: boolean }) => {
    return {
      block: cx(
        glass && stylish.blur,
        css`
          cursor: pointer;

          display: flex;
          flex: none;
          align-items: center;
          justify-content: center;

          color: ${active ? token.colorText : token.colorTextTertiary};

          background: ${active ? token.colorFillTertiary : 'transparent'};

          transition: color 600ms ${token.motionEaseOut}, transform 400ms ${token.motionEaseOut},
            background-color 100ms ${token.motionEaseOut};

          &:hover {
            color: ${token.colorText};
            background-color: ${token.colorFillSecondary};
          }

          &:active {
            transform: scale(0.8);
            color: ${token.colorText};
            background-color: ${token.colorFill};
          }
        `,
      ),
    };
  },
);
