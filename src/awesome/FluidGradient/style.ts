import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  root: css`
    pointer-events: none;

    position: absolute;
    z-index: 0;
    inset: 0;

    /* Soft CSS fallback so the hero never flashes empty white while WebGL boots. */
    background:
      radial-gradient(
        ellipse 80% 55% at 50% 0%,
        color-mix(in srgb, var(--fluid-stop-a, #7c5cff) 28%, transparent),
        transparent 70%
      ),
      radial-gradient(
        ellipse 60% 45% at 85% 20%,
        color-mix(in srgb, var(--fluid-stop-b, #d6549e) 22%, transparent),
        transparent 65%
      ),
      radial-gradient(
        ellipse 55% 40% at 15% 30%,
        color-mix(in srgb, var(--fluid-stop-c, #f0885f) 18%, transparent),
        transparent 60%
      );

    canvas {
      display: block;

      inline-size: 100%;
      block-size: 100%;

      opacity: 0;

      transition: opacity 700ms ease;
    }

    &[data-ready] canvas {
      opacity: 1;
    }

    @media (prefers-reduced-motion: reduce) {
      canvas {
        transition-duration: 0.01ms;
      }
    }
  `,
}));
