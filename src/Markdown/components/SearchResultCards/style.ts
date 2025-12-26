import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  container: css`
    min-width: 160px;
    max-width: 160px;
    height: 100%;

    font-size: 12px;
    color: initial;
  `,
  url: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    text-overflow: ellipsis;
  `,
}));
