import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }, size: number) => {
  const shadowSize = size + '%';
  return {
    bottomShadow: css`
      mask-image: linear-gradient(180deg, #000 calc(100% - ${shadowSize}), transparent);
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
        #000 ${shadowSize},
        #000 calc(100% - ${shadowSize}),
        transparent
      );
    `,

    // 水平滚动阴影
    leftShadow: css`
      mask-image: linear-gradient(270deg, #000 calc(100% - ${shadowSize}), transparent);
    `,

    rightShadow: css`
      mask-image: linear-gradient(90deg, #000 calc(100% - ${shadowSize}), transparent);
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
        #000 ${shadowSize},
        #000 calc(100% - ${shadowSize}),
        transparent
      );
    `,

    // 垂直滚动阴影
    topShadow: css`
      mask-image: linear-gradient(0deg, #000 calc(100% - ${shadowSize}), transparent);
    `,

    vertical: css`
      overflow-y: auto;
    `,
  };
});
