import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { SMOOTH_CORNER_MASKS } from '@/utils/smoothCorners';

export const styles = createStaticStyles(({ css }) => {
  const createCornerVariant = (cornerType: keyof typeof SMOOTH_CORNER_MASKS) => css`
    mask-image: url('${SMOOTH_CORNER_MASKS[cornerType]}');
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
  `;

  return {
    circle: createCornerVariant('circle'),
    ios: createCornerVariant('ios'),
    root: css`
      overflow: hidden;
      flex: none;

      /* Fallback for browsers without mask support */
      border-radius: 15%;

      /* Apply smooth corners mask with fallback */
      @supports (mask-image: url('data:image/svg+xml;base64,')) {
        border-radius: 0;
      }
    `,
    sharp: createCornerVariant('sharp'),
    smooth: createCornerVariant('smooth'),
    square: createCornerVariant('square'),
    squircle: createCornerVariant('squircle'),
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    cornerShape: 'squircle',
  },

  variants: {
    cornerShape: {
      circle: styles.circle,
      ios: styles.ios,
      sharp: styles.sharp,
      smooth: styles.smooth,
      square: styles.square,
      squircle: styles.squircle,
    },
  },
});
