import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  canvas: {
    transition: 'opacity 700ms ease',
    blockSize: '100%',
    display: 'block',
    inlineSize: '100%',
    opacity: 0,
    transitionDuration: { 'default': null, '@media (prefers-reduced-motion: reduce)': '0.01ms' },
  },
  canvasReady: {
    opacity: 1,
  },
  root: {
    inset: 0,
    /* Soft CSS fallback so the hero never flashes empty white while WebGL boots. */
    backgroundImage:
      'radial-gradient(ellipse 80% 55% at 50% 0%, color-mix(in srgb, var(--fluid-stop-a, #7c5cff) 28%, transparent), transparent 70%), radial-gradient(ellipse 60% 45% at 85% 20%, color-mix(in srgb, var(--fluid-stop-b, #d6549e) 22%, transparent), transparent 65%), radial-gradient(ellipse 55% 40% at 15% 30%, color-mix(in srgb, var(--fluid-stop-c, #f0885f) 18%, transparent), transparent 60%)',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 0,
  },
});
