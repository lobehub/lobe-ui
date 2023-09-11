import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token, stylish, cx }, { active, glass }: { active: boolean; glass: boolean }) => {
    return {
      block: cx(
        glass && stylish.blur,
        css`
          cursor: pointer;

          position: relative;

          display: flex;
          flex: none;
          align-items: center;
          justify-content: center;

          color: ${active ? token.colorText : token.colorTextTertiary};

          background: ${active ? token.colorFillTertiary : 'transparent'};

          transition:
            color 600ms ${token.motionEaseOut},
            scale 400ms ${token.motionEaseOut},
            background-color 100ms ${token.motionEaseOut};

          &:hover {
            color: ${token.colorText};
            background-color: ${token.colorFillSecondary};
          }

          &:active {
            color: ${token.colorText};
            background-color: ${token.colorFill};
          }
        `,
      ),
      icon: css`
        transition: scale 400ms ${token.motionEaseOut};

        &:active {
          scale: 0.8;
        }
      `,
    };
  },
);
