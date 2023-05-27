import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }, { active, glass }: { active: boolean; glass: boolean }) => {
    return {
      block: css`
        cursor: pointer;

        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;

        color: ${active ? token.colorText : token.colorTextTertiary};

        background: ${active ? token.colorFillTertiary : 'transparent'};

        transition: color 600ms ${token.motionEaseOut},
          background-color 100ms ${token.motionEaseOut};

        ${glass &&
        css`
          backdrop-filter: saturate(180%) blur(10px);
        `}

        &:hover {
          color: ${token.colorText};
          background-color: ${token.colorFillSecondary};
        }

        &:active {
          color: ${token.colorText};
          background-color: ${token.colorFill};
        }
      `,
    };
  },
);
