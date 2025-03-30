import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, token, stylish, cx },
    {
      active,
      glass,
      variant,
    }: { active: boolean; glass: boolean; variant: 'default' | 'block' | 'ghost' },
  ) => {
    const isBlock = variant === 'block';
    const isGhost = variant === 'ghost';

    return {
      block: cx(
        glass && stylish.blur,
        isGhost &&
          css`
            border: 1px solid ${token.colorBorderSecondary};
          `,
        css`
          position: relative;

          flex: none;

          color: ${active ? token.colorText : token.colorTextTertiary};

          background: ${active || isBlock ? token.colorFillTertiary : 'transparent'};

          transition:
            color 600ms ${token.motionEaseOut},
            scale 400ms ${token.motionEaseOut},
            background-color 100ms ${token.motionEaseOut};
        `,
      ),
      disabled: css`
        cursor: not-allowed;
        opacity: 0.5;
      `,
      icon: css`
        transition: scale 400ms ${token.motionEaseOut};

        &:active {
          scale: 0.8;
        }
      `,
      normal: css`
        cursor: pointer;

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
