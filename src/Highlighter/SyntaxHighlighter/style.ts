import { createStaticStyles, cx, keyframes } from 'antd-style';
import { cva } from 'class-variance-authority';

const fadeIn = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `;

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    animated: css`
      .animate-fade-in,
      .katex-html > .base,
      span.line > span,
      code:not(:has(span.line)) {
        opacity: 1;
        animation: ${fadeIn} 1s ease-in-out;
      }

      /* 只对 .base 级别的 span 应用流式动画，不要穿透到内部 */
      .katex-display .katex-html span {
        mask: none !important;
        animation: none !important;
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
      }
    `,
    shiki: cx(
      'ant-highlighter-highlighter-shiki',
      css`
        pre {
          user-select: none;

          code {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .line {
              user-select: text;

              display: block;

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
            background: ${cssVar.colorFillTertiary};

            &.warning {
              background: ${cssVar.colorWarningBg};
            }

            &.error {
              background: ${cssVar.colorErrorBg};
            }
          }

          .highlighted-word {
            padding-block: 0.1em;
            padding-inline: 0.2em;
            border: 1px solid ${cssVar.colorBorderSecondary};
            border-radius: ${cssVar.borderRadius};

            background: ${cssVar.colorFillTertiary};
          }

          .diff {
            &.remove {
              background: ${cssVar.colorErrorBg};

              &::before {
                content: '-';

                position: absolute;
                inset-inline-start: 4px;

                display: inline-block;

                color: ${cssVar.colorErrorText};
              }
            }

            &.add {
              background: ${cssVar.colorSuccessBg};

              &::before {
                content: '+';

                position: absolute;
                inset-inline-start: 4px;

                display: inline-block;

                color: ${cssVar.colorSuccessText};
              }
            }
          }
        }
      `,
    ),
    unshiki: css`
      color: ${cssVar.colorTextDescription};
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    animated: false,
    shiki: true,
    showBackground: false,
    variant: 'borderless',
  },

  variants: {
    shiki: {
      false: styles.unshiki,
      true: styles.shiki,
    },
    showBackground: {
      false: styles.noBackground,
      true: null,
    },
    animated: {
      true: styles.animated,
      false: null,
    },
    variant: {
      filled: styles.padding,
      outlined: styles.padding,
      borderless: styles.noPadding,
    },
  },
});
