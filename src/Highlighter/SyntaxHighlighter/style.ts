import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, cx, prefixCls }) => {
  return {
    animated: css`
      pre {
        code {
          .line {
            display: block;
          }
        }
      }
    `,

    noBackground: css`
      pre {
        background: transparent !important;
      }
    `,

    noPadding: css`
      pre {
        padding: 0;
      }
    `,

    padding: css`
      pre {
        padding: 16px;
      }
    `,
    root: css`
      direction: ltr;
      margin: 0;
      padding: 0;
      text-align: start;

      pre {
        overflow-x: auto;
        margin: 0;
        padding: 0;
      }
    `,
    shiki: cx(
      `${prefixCls}-highlighter-shiki`,
      css`
        pre {
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
            border: 1px solid ${token.colorBorderSecondary};
            border-radius: ${token.borderRadius}px;

            background: ${token.colorFillTertiary};
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
