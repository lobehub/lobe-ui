import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css }) => {
  return {
    bottomShadow: css`
      mask-image: linear-gradient(
        180deg,
        #000 calc(100% - var(--scroll-shadow-size, 40%)),
        transparent
      );
    `,
    hideScrollBar: css`
      scrollbar-width: none;

      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    `,
    horizontal: css`
      overflow-x: auto;
    `,

    leftRightShadow: css`
      mask-image: linear-gradient(
        to right,
        #000,
        #000,
        transparent 0,
        #000 var(--scroll-shadow-size, 40%),
        #000 calc(100% - var(--scroll-shadow-size, 40%)),
        transparent
      );
    `,

    // 水平滚动阴影
    leftShadow: css`
      mask-image: linear-gradient(
        270deg,
        #000 calc(100% - var(--scroll-shadow-size, 40%)),
        transparent
      );
    `,

    rightShadow: css`
      mask-image: linear-gradient(
        90deg,
        #000 calc(100% - var(--scroll-shadow-size, 40%)),
        transparent
      );
    `,

    root: css`
      position: relative;
      overflow: hidden;
    `,

    topBottomShadow: css`
      mask-image: linear-gradient(
        #000,
        #000,
        transparent 0,
        #000 var(--scroll-shadow-size, 40%),
        #000 calc(100% - var(--scroll-shadow-size, 40%)),
        transparent
      );
    `,

    // 垂直滚动阴影
    topShadow: css`
      mask-image: linear-gradient(
        0deg,
        #000 calc(100% - var(--scroll-shadow-size, 40%)),
        transparent
      );
    `,

    vertical: css`
      overflow-y: auto;
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    hideScrollBar: false,
    orientation: 'vertical',
    scrollPosition: 'none',
  },

  variants: {
    orientation: {
      horizontal: styles.horizontal,
      vertical: styles.vertical,
    },
    hideScrollBar: {
      true: styles.hideScrollBar,
      false: null,
    },
    scrollPosition: {
      'none': null,
      'top': styles.topShadow,
      'bottom': styles.bottomShadow,
      'top-bottom': styles.topBottomShadow,
      'left': styles.leftShadow,
      'right': styles.rightShadow,
      'left-right': styles.leftRightShadow,
    },
  },
});
