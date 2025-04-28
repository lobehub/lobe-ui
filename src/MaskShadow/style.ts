import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }, size: number) => {
  const shadowSize = size + '%';
  return {
    bottomShadow: css`
      mask-image: linear-gradient(180deg, #000 calc(100% - ${shadowSize}), transparent);
    `,

    leftShadow: css`
      mask-image: linear-gradient(270deg, #000 calc(100% - ${shadowSize}), transparent);
    `,

    rightShadow: css`
      mask-image: linear-gradient(90deg, #000 calc(100% - ${shadowSize}), transparent);
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
      mask-image: linear-gradient(0deg, #000 calc(100% - ${shadowSize}), transparent);
    `,
  };
});
