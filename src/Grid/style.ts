import { createStyles } from 'antd-style';
import { isString } from 'es-toolkit/compat';

export const useStyles = createStyles(
  (
    { css },
    {
      rows,
      maxItemWidth,
      gap,
    }: { gap: string | number; maxItemWidth: string | number; rows: number },
  ) => {
    return css`
      --rows: ${rows};
      --max-item-width: ${isString(maxItemWidth) ? maxItemWidth : `${maxItemWidth}px`};
      --gap: ${isString(gap) ? gap : `${gap}px`};

      display: grid !important;
      grid-template-columns: repeat(
        auto-fill,
        minmax(
          max(var(--max-item-width), calc((100% - var(--gap) * (var(--rows) - 1)) / var(--rows))),
          1fr
        )
      );
    `;
  },
);
