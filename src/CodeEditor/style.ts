import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: cx(
      lobeStaticStylish.variantBorderlessWithoutHover,
      css`
        border-radius: 0;

        pre,
        textarea {
          padding: 0;
        }
      `,
    ),
    filled: lobeStaticStylish.variantFilledWithoutHover,
    highlight: css`
      pointer-events: none;
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;

      overflow: hidden auto;

      width: 100%;
      height: fit-content;
      border-radius: ${cssVar.borderRadius};

      font-size: 12px;

      pre,
      textarea {
        margin: 0;
        padding: 16px;
      }

      textarea,
      pre,
      code {
        overflow: hidden;

        font-family: ${cssVar.fontFamilyCode};
        font-size: inherit;
        line-height: inherit;
        word-break: inherit;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    `,
    textarea: css`
      resize: none;

      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 0;

      overflow: hidden;

      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 0;
      border: none;

      color: transparent;
      text-align: start;

      background: transparent;
      outline: none;
      caret-color: ${cssVar.colorText};

      &::placeholder {
        color: ${cssVar.colorTextQuaternary};
      }

      &:focus {
        border: none;
        outline: none;
        box-shadow: none;
      }
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    variant: 'borderless',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
