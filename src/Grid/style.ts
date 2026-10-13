import { createStaticStyles } from 'antd-style';

/**
 * `--max-item-width` is the column's minimum width. Clamp it to the container,
 * otherwise a value wider than a phone screen overflows the page instead of
 * collapsing to one column.
 */
export const gridTemplateColumns =
  'repeat(auto-fill, minmax(max(min(var(--max-item-width), 100%), calc((100% - var(--gap) * (var(--rows) - 1)) / var(--rows))), 1fr))';

export const styles = createStaticStyles(({ css }) => {
  return css`
    --rows: var(--grid-rows, 3);
    --max-item-width: var(--grid-max-item-width, 240px);
    --gap: var(--grid-gap, 1em);

    display: grid !important;
    grid-template-columns: ${gridTemplateColumns};
  `;
});
