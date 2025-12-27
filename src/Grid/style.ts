import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  return css`
    --rows: var(--grid-rows, 3);
    --max-item-width: var(--grid-max-item-width, 240px);
    --gap: var(--grid-gap, 1em);

    display: grid !important;
    grid-template-columns: repeat(
      auto-fill,
      minmax(
        max(var(--max-item-width), calc((100% - var(--gap) * (var(--rows) - 1)) / var(--rows))),
        1fr
      )
    );
  `;
});
