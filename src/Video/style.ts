import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

// 用于 hover 选择器的类名标识
export const maskHoverCls = 'lobe-video-mask';

export const styles = createStaticStyles(({ css, cssVar }) => {
  const mask = css`
    pointer-events: none;

    position: absolute;
    z-index: 1;
    inset: 0;

    width: 100%;
    height: 100%;

    opacity: 0;
    background: ${cssVar.colorBgMask};

    transition: opacity 0.2s ease;
  `;

  return {
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    filled: cx(
      lobeStaticStylish.variantOutlinedWithoutHover,
      lobeStaticStylish.variantFilledWithoutHover,
    ),
    mask: cx(maskHoverCls, mask),
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;

      overflow: hidden;

      width: 100%;
      min-width: var(--video-min-width, unset);
      max-width: var(--video-max-width, 100%);
      height: auto;
      min-height: var(--video-min-height, unset);
      max-height: var(--video-max-height, 100%);
      margin-block: 0 1em;
      border-radius: ${cssVar.borderRadius};

      background: ${cssVar.colorFillTertiary};

      &:hover {
        [class*='${maskHoverCls}'] {
          opacity: 1;
        }
      }
    `,
    video: css`
      cursor: pointer;
      width: 100%;
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    variant: 'filled',
  },

  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
  },
});
