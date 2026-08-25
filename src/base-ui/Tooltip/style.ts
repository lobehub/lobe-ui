import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  arrow: css`
    --lobe-tooltip-arrow-offset-block: 4px;
    --lobe-tooltip-arrow-offset-inline: 6px;

    pointer-events: none;

    position: absolute;
    transform-origin: center;

    display: flex;

    width: 8px;
    height: 4px;

    & > svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: ${cssVar.colorBgElevated};
    }

    & [data-role='stroke'] {
      stroke: ${cssVar.colorBorderSecondary};
    }

    &[data-side='top'] {
      inset-block-end: calc(var(--lobe-tooltip-arrow-offset-block) * -1);
      transform: rotate(180deg);
    }

    &[data-side='left'] {
      inset-inline-end: calc(var(--lobe-tooltip-arrow-offset-inline) * -1);
      transform: rotate(90deg);
    }

    &[data-side='right'] {
      inset-inline-start: calc(var(--lobe-tooltip-arrow-offset-inline) * -1);
      transform: rotate(-90deg);
    }

    &[data-side='bottom'] {
      inset-block-start: calc(var(--lobe-tooltip-arrow-offset-block) * -1);
    }
  `,

  popup: css`

    /* Keep the popup on its own compositor layer for its whole lifetime: when the opacity
       transition ends the browser otherwise drops the layer and re-rasterizes with pixel
       snapping — a visible one-frame shift when the measured width is fractional
       (single-line tooltips). */
    will-change: transform, opacity;
    user-select: none;

    position: relative;
    transform-origin: var(--transform-origin);

    max-width: min(320px, var(--available-width));
    border: 1px solid ${cssVar.colorFill};
    border-radius: ${cssVar.borderRadiusSM};

    font-size: ${cssVar.fontSizeSM};
    line-height: 1.2;
    color: ${cssVar.colorTextLabel};

    background: ${cssVar.colorBgElevated};
    box-shadow:
      0 1px 2px 0 rgb(0 0 0 / 3%),
      0 1px 6px -1px rgb(0 0 0 / 2%),
      0 2px 4px 0 rgb(0 0 0 / 2%);

    /* Opacity gets its own monotonic curve: running it on the overshooting spring makes the
       fade look finished at ~0.96, pause, then visibly step to 1 at the clamp point — reads
       as a dropped frame. The spring stays on transform only. */
    transition-timing-function:
      var(--lobe-tooltip-fade-ease), var(--lobe-tooltip-animation-ease-out);
    transition-duration: var(--lobe-tooltip-fade-duration), var(--lobe-tooltip-animation-duration);
    transition-property: opacity, transform;

    &[data-layout-animation] {
      transition-timing-function:
        var(--lobe-tooltip-fade-ease), var(--lobe-tooltip-animation-ease-out),
        var(--lobe-tooltip-layout-ease), var(--lobe-tooltip-layout-ease);
      transition-duration:
        var(--lobe-tooltip-fade-duration), var(--lobe-tooltip-animation-duration),
        var(--lobe-tooltip-layout-duration), var(--lobe-tooltip-layout-duration);
      transition-property: opacity, transform, width, height;
    }

    &[data-starting-style],
    &[data-ending-style] {
      transform: translate3d(var(--lobe-tooltip-translate-x), var(--lobe-tooltip-translate-y), 0)
        scale(var(--lobe-tooltip-animation-scale));
      opacity: 0;
    }

    &[data-ending-style] {
      transition-timing-function: var(--lobe-tooltip-animation-ease-in);
      transition-duration: var(--lobe-tooltip-animation-duration-exit);
    }

    &[data-instant] {
      transition: none;
    }
  `,

  positioner: css`
    /* Springs baked as linear(): stiffness 700 / damping 38 (enter) and 380 / 28 (glide),
       both zeta ~0.72 with ~4% overshoot. Durations are the springs' settle times —
       change them together with the curves, not independently. */
    --lobe-tooltip-animation-duration: 280ms;
    --lobe-tooltip-fade-duration: 160ms;
    --lobe-tooltip-fade-ease: cubic-bezier(0.33, 1, 0.68, 1);
    --lobe-tooltip-animation-duration-exit: 100ms;
    --lobe-tooltip-animation-translate: 3px;
    --lobe-tooltip-animation-scale: 0.97;
    --lobe-tooltip-animation-ease-in: cubic-bezier(0.4, 0, 1, 1);
    --lobe-tooltip-animation-ease-out: linear(
      0,
      0.041,
      0.14,
      0.268,
      0.407,
      0.541,
      0.662,
      0.765,
      0.849,
      0.915,
      0.964,
      0.998,
      1.02,
      1.032,
      1.038,
      1.039,
      1.036,
      1.032,
      1.027,
      1.022,
      1.016,
      1.012,
      1.008,
      1.005,
      1.003
    );
    --lobe-tooltip-layout-duration: 380ms;
    --lobe-tooltip-layout-ease: linear(
      0,
      0.041,
      0.14,
      0.268,
      0.407,
      0.541,
      0.661,
      0.765,
      0.849,
      0.915,
      0.964,
      0.998,
      1.02,
      1.032,
      1.038,
      1.039,
      1.036,
      1.032,
      1.027,
      1.022,
      1.016,
      1.012,
      1.008,
      1.005,
      1.003
    );
    --lobe-tooltip-translate-x: 0;
    --lobe-tooltip-translate-y: calc(var(--lobe-tooltip-animation-translate) * -1);

    will-change: transform, opacity;

    z-index: 114514;

    width: min(var(--positioner-width), 320px, var(--available-width));
    height: var(--positioner-height);

    transition-timing-function: var(--lobe-tooltip-animation-ease-out);
    transition-duration: var(--lobe-tooltip-animation-duration);
    transition-property: none;

    &[data-layout-animation] {
      transition-timing-function: var(--lobe-tooltip-layout-ease);
      transition-duration: var(--lobe-tooltip-layout-duration);
      transition-property:
        inset-block-start, inset-inline-start, inset-inline-end, inset-block-end, transform;
    }

    &[data-instant] {
      transition: none;
    }

    /* Fallback: never show a tooltip when the anchor is hidden or the positioner falls back to (0,0). */
    &[data-anchor-hidden],
    &[data-zero-origin='true'] {
      pointer-events: none;
      visibility: hidden;
    }

    &[data-placement='top'],
    &[data-placement='topLeft'],
    &[data-placement='topRight'] {
      --lobe-tooltip-translate-x: 0;
      --lobe-tooltip-translate-y: var(--lobe-tooltip-animation-translate);
    }

    &[data-placement='bottom'],
    &[data-placement='bottomLeft'],
    &[data-placement='bottomRight'] {
      --lobe-tooltip-translate-x: 0;
      --lobe-tooltip-translate-y: calc(var(--lobe-tooltip-animation-translate) * -1);
    }

    &[data-placement='left'],
    &[data-placement='leftTop'],
    &[data-placement='leftBottom'] {
      --lobe-tooltip-translate-x: var(--lobe-tooltip-animation-translate);
      --lobe-tooltip-translate-y: 0;
    }

    &[data-placement='right'],
    &[data-placement='rightTop'],
    &[data-placement='rightBottom'] {
      --lobe-tooltip-translate-x: calc(var(--lobe-tooltip-animation-translate) * -1);
      --lobe-tooltip-translate-y: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      --lobe-tooltip-animation-duration: 0s;
      --lobe-tooltip-fade-duration: 0s;
      --lobe-tooltip-animation-duration-exit: 0s;
      --lobe-tooltip-layout-duration: 0s;
    }
  `,

  viewport: css`
    --lobe-tooltip-viewport-inline-padding: 8px;
    --lobe-tooltip-content-shift: 40%;

    position: relative;

    overflow: clip;
    display: flex;
    gap: 6px;
    align-items: center;

    padding-block: 4px;
    padding-inline: var(--lobe-tooltip-viewport-inline-padding);

    overflow-wrap: break-word;
    white-space: normal;

    [data-previous],
    [data-current] {
      transform: translateX(0);

      display: flex;
      gap: 6px;
      align-items: center;

      opacity: 1;

      transition:
        transform var(--lobe-tooltip-layout-duration) var(--lobe-tooltip-layout-ease),
        opacity calc(var(--lobe-tooltip-layout-duration) / 2) var(--lobe-tooltip-fade-ease);
    }

    [data-previous] {
      position: absolute;
      inset-block-start: 4px;
      inset-inline-start: var(--lobe-tooltip-viewport-inline-padding);
    }

    &[data-activation-direction~='right'] [data-previous][data-ending-style] {
      transform: translateX(calc(var(--lobe-tooltip-content-shift) * -1));
      opacity: 0;
    }

    &[data-activation-direction~='right'] [data-current][data-starting-style] {
      transform: translateX(var(--lobe-tooltip-content-shift));
      opacity: 0;
    }

    &[data-activation-direction~='left'] [data-previous][data-ending-style] {
      transform: translateX(var(--lobe-tooltip-content-shift));
      opacity: 0;
    }

    &[data-activation-direction~='left'] [data-current][data-starting-style] {
      transform: translateX(calc(var(--lobe-tooltip-content-shift) * -1));
      opacity: 0;
    }

    &[data-activation-direction~='down'] [data-previous][data-ending-style] {
      transform: translateY(calc(var(--lobe-tooltip-content-shift) * -1));
      opacity: 0;
    }

    &[data-activation-direction~='down'] [data-current][data-starting-style] {
      transform: translateY(var(--lobe-tooltip-content-shift));
      opacity: 0;
    }

    &[data-activation-direction~='up'] [data-previous][data-ending-style] {
      transform: translateY(var(--lobe-tooltip-content-shift));
      opacity: 0;
    }

    &[data-activation-direction~='up'] [data-current][data-starting-style] {
      transform: translateY(calc(var(--lobe-tooltip-content-shift) * -1));
      opacity: 0;
    }
  `,
}));
