import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css }) => {
  return {
    bottomShadow: css`
      mask-image: linear-gradient(
        180deg,
        #000 calc(100% - var(--mask-shadow-size, 40%)),
        transparent
      );
    `,

    leftShadow: css`
      mask-image: linear-gradient(
        270deg,
        #000 calc(100% - var(--mask-shadow-size, 40%)),
        transparent
      );
    `,

    rightShadow: css`
      mask-image: linear-gradient(
        90deg,
        #000 calc(100% - var(--mask-shadow-size, 40%)),
        transparent
      );
    `,

    root: css`
      scrollbar-width: none;
      position: relative;
      overflow: hidden;

      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    `,

    topShadow: css`
      mask-image: linear-gradient(
        0deg,
        #000 calc(100% - var(--mask-shadow-size, 40%)),
        transparent
      );
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    position: 'bottom',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    position: {
      top: styles.topShadow,
      bottom: styles.bottomShadow,
      left: styles.leftShadow,
      right: styles.rightShadow,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
