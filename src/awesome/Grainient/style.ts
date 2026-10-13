import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  root: css`
    pointer-events: none;

    position: absolute;
    z-index: 0;
    inset: 0;

    overflow: hidden;

    canvas {
      position: absolute;
      inset: 0;

      display: block;

      inline-size: 100%;
      block-size: 100%;
    }
  `,
}));
