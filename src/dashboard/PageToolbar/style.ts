import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  actions: css`
    display: flex;
    flex: none;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    margin-inline-start: auto;
  `,
  filters: css`
    display: flex;
    flex: 0 1 auto;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    min-inline-size: 0;
  `,
  root: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    align-items: center;

    min-inline-size: 0;
  `,
}));
