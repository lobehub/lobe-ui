import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, cx, prefixCls, stylish }) => {
  const prefix = `${prefixCls}-highlighter`;

  return {
    loading: cx(
      stylish.blur,
      css`
        position: absolute;
        z-index: 10;
        inset-block-start: 0;
        inset-inline-end: 0;

        height: 34px;
        padding-block: 0;
        padding-inline: 8px;

        font-family: ${token.fontFamilyCode};
        color: ${token.colorTextTertiary};

        border-radius: ${token.borderRadius};
      `,
    ),
    shiki: cx(
      `${prefix}-shiki`,
      css`
        margin: 0;
        padding: 0;

        .shiki {
          overflow-x: auto;

          margin: 0;
          padding: 0;

          text-wrap: wrap;
          word-break: break-word;

          background: none !important;

          code {
            display: block;

            .line {
              display: inline-block;

              width: calc(100% + 32px);
              margin-block: 0;
              margin-inline: -16px;
              padding-block: 0;
              padding-inline: 16px;
            }
          }

          &.has-focused {
            .line:not(.focused) {
              opacity: 0.5;
            }
          }

          .highlighted {
            background: ${token.colorFillTertiary};

            &.warning {
              background: ${token.colorWarningBg};
            }

            &.error {
              background: ${token.colorErrorBg};
            }
          }

          .highlighted-word {
            padding-block: 0.1em;
            padding-inline: 0.2em;

            background: ${token.colorFillTertiary};
            border: 1px solid ${token.colorBorderSecondary};
            border-radius: ${token.borderRadius}px;
          }

          .diff {
            &.remove {
              background: ${token.colorErrorBg};

              &::before {
                content: '-';

                position: absolute;
                inset-inline-start: 4px;

                display: inline-block;

                color: ${token.colorErrorText};
              }
            }

            &.add {
              background: ${token.colorSuccessBg};

              &::before {
                content: '+';

                position: absolute;
                inset-inline-start: 4px;

                display: inline-block;

                color: ${token.colorSuccessText};
              }
            }
          }
        }
      `,
    ),
    unshiki: css`
      color: ${token.colorTextDescription};
    `,
  };
});
