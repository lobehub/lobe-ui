import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { controlHeight } from '@/base-ui/controlSize';
import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  clear: css`
    cursor: pointer;

    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    width: 16px;
    height: 16px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    color: ${cssVar.colorBgContainer};

    visibility: hidden;
    background: ${cssVar.colorTextQuaternary};

    &:hover {
      background: ${cssVar.colorTextTertiary};
    }
  `,
  count: css`
    pointer-events: none;

    position: absolute;
    inset-block-end: 6px;
    inset-inline-end: 8px;

    display: inline-flex;
    align-items: center;

    height: 20px;
    padding-inline: 8px;
    border-radius: 999px;

    font-size: 11px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorTextSecondary};

    background: ${cssVar.colorFillTertiary};

    &[data-over] {
      color: ${cssVar.colorWhite};
      background: ${cssVar.colorError};
    }
  `,
  textareaClear: css`
    position: absolute;
    inset-block-start: 10px;
    inset-inline-end: 10px;
  `,
  textareaWithCount: css`
    padding-block-end: 30px;
  `,
  borderless: css`
    border: 1px solid transparent;
    background: none;
  `,
  filled: css`
    border: 1px solid transparent;
    background: ${cssVar.colorFillTertiary};

    &:hover:not(:focus-within, [data-disabled]) {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  input: css`
    flex: 1;

    min-width: 0;
    padding: 0;
    border: none;

    font: inherit;
    color: inherit;

    appearance: none;
    background: transparent;
    outline: none;

    &::placeholder {
      color: ${cssVar.colorTextPlaceholder};
    }

    /* the root shows focus via its border; outrank global :focus-visible rings */
    &:focus-visible {
      outline: none;
    }
  `,
  invalid: css`
    &:has([data-invalid], [aria-invalid='true']) {
      border-color: ${cssVar.colorError};

      &:focus-within {
        border-color: ${cssVar.colorError};
        box-shadow: 0 0 0 2px ${cssVar.colorErrorBg};
      }
    }
  `,
  outlined: css`
    border: 1px solid ${cssVar.colorBorderSecondary};
    background: ${cssVar.colorBgContainer};

    &:hover:not(:focus-within, [data-disabled]) {
      border-color: ${cssVar.colorBorder};
    }

    &:focus-within {
      border-color: ${cssVar.colorPrimary};
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBg};
    }
  `,
  root: css`
    cursor: text;

    display: inline-flex;
    gap: 8px;
    align-items: center;

    box-sizing: border-box;
    width: 100%;
    padding-inline: 12px;
    border-radius: ${cssVar.borderRadius};

    font-size: 14px;
    color: ${cssVar.colorText};

    transition:
      background 150ms ${cssVar.motionEaseOut},
      border-color 150ms ${cssVar.motionEaseOut},
      box-shadow 150ms ${cssVar.motionEaseOut};

    &[data-disabled],
    &:has(:disabled) {
      cursor: not-allowed;
      color: ${cssVar.colorTextQuaternary};
      opacity: 0.66;
    }

    &:hover [data-lobe-input-clear],
    &:focus-within [data-lobe-input-clear] {
      visibility: visible;
    }
  `,
  shadow: lobeStaticStylish.shadow,
  sizeLarge: css`
    min-height: ${controlHeight.large}px;
    border-radius: ${cssVar.borderRadiusLG};
    font-size: 16px;
  `,
  sizeMiddle: css`
    min-height: ${controlHeight.middle}px;
  `,
  sizeSmall: css`
    min-height: ${controlHeight.small}px;
    padding-inline: 8px;
    border-radius: ${cssVar.borderRadiusSM};
    font-size: 12px;
  `,
  numberControl: css`
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 20px;
    height: 13px;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 4px;

    color: ${cssVar.colorTextTertiary};

    background: none;
    outline: none;

    transition:
      color 150ms ${cssVar.motionEaseOut},
      background 150ms ${cssVar.motionEaseOut};

    &:hover:not(:disabled) {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  `,
  numberControlLarge: css`
    width: 22px;
    height: 15px;
  `,
  numberControlSmall: css`
    width: 16px;
    height: 10px;
    border-radius: 3px;
  `,
  numberControls: css`
    display: flex;
    flex: none;
    flex-direction: column;
    margin-inline-end: -6px;
  `,
  numberControlsSmall: css`
    margin-inline-end: -4px;
  `,
  numberInput: css`
    font-variant-numeric: tabular-nums;
  `,
  otpCell: css`
    flex: none;
    width: ${controlHeight.middle}px;
    padding-inline: 0;
    text-align: center;
  `,
  otpRoot: css`
    display: inline-flex;
    gap: 8px;
    align-items: center;
  `,
  passwordToggle: css`
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    margin: 0;
    padding: 0;
    border: none;

    color: ${cssVar.colorTextTertiary};

    background: none;
    outline: none;

    transition: color 150ms ${cssVar.motionEaseOut};

    &:hover {
      color: ${cssVar.colorText};
    }
  `,
  slot: css`
    display: inline-flex;
    flex: none;
    align-items: center;
    color: ${cssVar.colorTextTertiary};
  `,
  textarea: css`
    position: relative;
    height: auto;
    padding-block: 8px;

    textarea {
      resize: none;
      min-height: calc(1.5em * var(--textarea-min-rows, 2));
      max-height: var(--textarea-max-height, none);
      line-height: 1.5;
    }
  `,
  textareaAutoSize: css`
    textarea {
      field-sizing: content;
    }
  `,
  textareaResize: css`
    textarea {
      resize: vertical;
    }
  `,
}));

export const rootVariants = cva([styles.root, styles.invalid], {
  defaultVariants: {
    shadow: false,
    size: 'middle',
    variant: 'outlined',
  },
  variants: {
    shadow: {
      false: null,
      true: styles.shadow,
    },
    size: {
      large: styles.sizeLarge,
      middle: styles.sizeMiddle,
      small: styles.sizeSmall,
    },
    variant: {
      borderless: styles.borderless,
      filled: styles.filled,
      outlined: styles.outlined,
    },
  },
});
