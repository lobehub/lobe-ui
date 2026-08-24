import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  heroTexture: css`
    pointer-events: none;

    position: absolute;
    z-index: -1;
    inset-block: calc(-1 * var(--docs-header-height)) 0;
    inset-inline: 0;

    opacity: 0;

    transition: opacity 700ms ease;

    &[data-ready] {
      opacity: 1;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `,
}));
