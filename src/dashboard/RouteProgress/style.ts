import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bar: css`
    will-change: transform, opacity;

    position: fixed;
    z-index: 1000;
    inset-block-start: 0;
    inset-inline: 0;
    transform-origin: 0 50%;

    block-size: 2px;

    background: ${cssVar.colorPrimary};
  `,
}));
