import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => {
  return {
    editor: css`
      width: inherit;
      min-height: inherit;
    `,
    left: css`
      position: relative;
      overflow: auto;
    `,
    leftWithPadding: css`
      position: relative;
      overflow: auto;
      padding-block: 40px;
      padding-inline: 24px;
    `,
    leva: css`
      --leva-sizes-controlWidth: 66%;
      --leva-colors-elevation1: ${cssVar.colorFillSecondary};
      --leva-colors-elevation2: transparent;
      --leva-colors-elevation3: ${cssVar.colorFillSecondary};
      --leva-colors-accent1: ${cssVar.colorPrimary};
      --leva-colors-accent2: ${cssVar.colorPrimaryHover};
      --leva-colors-accent3: ${cssVar.colorPrimaryActive};
      --leva-colors-highlight1: ${cssVar.colorTextTertiary};
      --leva-colors-highlight2: ${cssVar.colorTextSecondary};
      --leva-colors-highlight3: ${cssVar.colorText};
      --leva-colors-vivid1: ${cssVar.colorWarning};
      --leva-shadows-level1: unset;
      --leva-shadows-level2: unset;
      --leva-fonts-mono: ${cssVar.fontFamilyCode};

      overflow: auto;

      width: 100%;
      height: 100%;
      padding-block: 6px;
      padding-inline: 0;

      > div {
        background: transparent;

        > div {
          background: transparent;
        }
      }

      input:checked + label > svg {
        stroke: ${cssVar.colorBgLayout};
      }

      button {
        --leva-colors-accent2: ${cssVar.colorFillSecondary};
      }
    `,
    right: css`
      background: ${cssVar.colorBgLayout};

      ${responsive.sm} {
        .draggable-panel-fixed {
          width: 100% !important;
        }
      }
    `,
  };
});
