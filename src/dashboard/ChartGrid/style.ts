import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  /**
   * The frame is the container. A query on the grid itself would not see its own width.
   * Charts stay two-up so a trend and its switch stay readable; one child does not
   * stretch across the page.
   */
  frame: css`
    container-type: inline-size;

    @container (max-width: 640px) {
      & > * {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `,
  root: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    align-items: stretch;

    &:has(> :only-child) {
      grid-template-columns: minmax(0, min(100%, 560px));
    }
  `,
}));
