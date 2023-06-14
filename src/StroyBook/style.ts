import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }, { noPadding, mobile }: { mobile: boolean; noPadding: boolean }) => {
    return {
      editor: css`
        display: flex;
        align-items: stretch;
        justify-content: stretch;

        width: inherit;
        min-height: inherit;
        ${mobile &&
        css`
          flex-direction: column;
        `}
      `,
      left: css`
        overflow: auto;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;

        ${!noPadding &&
        css`
          padding: 40px 24px;
        `}
      `,
      right: css`
        background: ${token.colorBgLayout};

        .draggable-panel-fixed {
          width: 100% !important;
        }
      `,
      leva: css`
        --leva-sizes-controlWidth: 66%;
        --leva-colors-elevation1: ${token.colorFillSecondary};
        --leva-colors-elevation2: transparent;
        --leva-colors-elevation3: ${token.colorFillSecondary};
        --leva-colors-accent1: ${token.colorPrimary};
        --leva-colors-accent2: ${token.colorPrimaryHover};
        --leva-colors-accent3: ${token.colorPrimaryActive};
        --leva-colors-highlight1: ${token.colorTextTertiary};
        --leva-colors-highlight2: ${token.colorTextSecondary};
        --leva-colors-highlight3: ${token.colorText};
        --leva-colors-vivid1: ${token.colorWarning};
        --leva-shadows-level1: unset;
        --leva-shadows-level2: unset;
        --leva-fonts-mono: ${token.fontFamilyCode};

        overflow: auto;
        width: 100%;
        height: 100%;
        padding: 6px 0;

        > div {
          background: transparent;

          > div {
            background: transparent;
          }
        }

        input:checked + label > svg {
          stroke: ${token.colorBgLayout};
        }

        button {
          --leva-colors-accent2: ${token.colorFillSecondary};
        }
      `,
    };
  },
);
