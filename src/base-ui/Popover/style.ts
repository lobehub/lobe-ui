import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  arrow: css`
    --lobe-popover-arrow-offset-block: 5px;
    --lobe-popover-arrow-offset-inline: 8px;

    pointer-events: none;

    position: absolute;
    transform-origin: center;

    display: flex;

    width: 12px;
    height: 6px;

    transition:
      inset-inline-start var(--lobe-popover-layout-duration) var(--lobe-popover-layout-ease),
      inset-block-start var(--lobe-popover-layout-duration) var(--lobe-popover-layout-ease);

    & > svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    & [data-role='fill'] {
      fill: ${cssVar.colorBgElevated};
    }

    & [data-role='stroke'] {
      fill: none;
      stroke: ${cssVar.colorBorder};
      stroke-width: 1px;
    }

    &[data-side='top'] {
      inset-block-end: calc(var(--lobe-popover-arrow-offset-block) * -1);
      transform: rotate(180deg);
    }

    &[data-side='left'] {
      inset-inline-end: calc(var(--lobe-popover-arrow-offset-inline) * -1);
      transform: rotate(90deg);
    }

    &[data-side='right'] {
      inset-inline-start: calc(var(--lobe-popover-arrow-offset-inline) * -1);
      transform: rotate(-90deg);
    }

    &[data-side='bottom'] {
      inset-block-start: calc(var(--lobe-popover-arrow-offset-block) * -1);
    }
  `,

  popup: css`
    position: relative;
    transform-origin: var(--transform-origin);

    box-sizing: border-box;
    min-width: 120px;
    max-width: var(--available-width);
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadius};

    color: ${cssVar.colorText};

    background: ${cssVar.colorBgElevated};
    outline: none;
    box-shadow:
      0 0 15px 0 #00000008,
      0 2px 30px 0 #00000014;

    transition-timing-function: var(--lobe-popover-animation-ease-out);
    transition-duration: var(--lobe-popover-animation-duration);
    transition-property: opacity, transform;

    /* Base UI writes the old size into --popup-width/height on a trigger switch and the new size
       one frame later; the box only morphs if width/height actually read them. */
    &[data-layout-animation] {
      width: var(--popup-width, auto);
      height: var(--popup-height, auto);

      transition-timing-function:
        var(--lobe-popover-animation-ease-out), var(--lobe-popover-animation-ease-out),
        var(--lobe-popover-layout-ease), var(--lobe-popover-layout-ease);
      transition-duration:
        var(--lobe-popover-animation-duration), var(--lobe-popover-animation-duration),
        var(--lobe-popover-layout-duration), var(--lobe-popover-layout-duration);
      transition-property: opacity, transform, width, height;
    }

    &[data-repop] {
      transition: none;
    }

    &[data-starting-style],
    &[data-ending-style] {
      transform: translate3d(var(--lobe-popover-translate-x), var(--lobe-popover-translate-y), 0)
        scale(var(--lobe-popover-animation-scale));
      opacity: 0;
    }

    &[data-ending-style] {
      transition-timing-function: var(--lobe-popover-animation-ease-in);
      transition-duration: var(--lobe-popover-animation-duration-exit);
    }

    &[data-instant] {
      transition: none;
    }
  `,

  positioner: css`
    --lobe-popover-animation-duration: 150ms;
    --lobe-popover-animation-translate: 6px;
    --lobe-popover-animation-scale: 0.96;
    --lobe-popover-animation-ease-in: ease-in;
    --lobe-popover-animation-duration-exit: 75ms;
    --lobe-popover-animation-ease-out: ${cssVar.motionEaseOut};
    --lobe-popover-translate-x: 0;
    --lobe-popover-translate-y: calc(var(--lobe-popover-animation-translate) * -1);
    --lobe-popover-layout-duration: 380ms;
    --lobe-popover-layout-ease: linear(
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

    z-index: 1100;

    width: min(var(--positioner-width), var(--available-width));
    height: var(--positioner-height);

    transition-timing-function: var(--lobe-popover-animation-ease-out);
    transition-duration: var(--lobe-popover-animation-duration);
    transition-property: none;

    &[data-layout-animation] {
      transition-timing-function: var(--lobe-popover-layout-ease);
      transition-duration: var(--lobe-popover-layout-duration);
      transition-property:
        inset-block-start, inset-inline-start, inset-inline-end, inset-block-end, transform;
    }

    &[data-instant],
    &[data-repop] {
      transition: none;
    }

    /* Fallback: never show a popover when the anchor is hidden or the positioner falls back to (0,0). */
    &[data-anchor-hidden],
    &[data-zero-origin='true'] {
      pointer-events: none;
      visibility: hidden;
    }

    &[data-placement='top'],
    &[data-placement='topLeft'],
    &[data-placement='topRight'] {
      --lobe-popover-translate-x: 0;
      --lobe-popover-translate-y: var(--lobe-popover-animation-translate);
    }

    &[data-placement='bottom'],
    &[data-placement='bottomLeft'],
    &[data-placement='bottomRight'] {
      --lobe-popover-translate-x: 0;
      --lobe-popover-translate-y: calc(var(--lobe-popover-animation-translate) * -1);
    }

    &[data-placement='left'],
    &[data-placement='leftTop'],
    &[data-placement='leftBottom'] {
      --lobe-popover-translate-x: var(--lobe-popover-animation-translate);
      --lobe-popover-translate-y: 0;
    }

    &[data-placement='right'],
    &[data-placement='rightTop'],
    &[data-placement='rightBottom'] {
      --lobe-popover-translate-x: calc(var(--lobe-popover-animation-translate) * -1);
      --lobe-popover-translate-y: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      --lobe-popover-layout-duration: 0s;
    }
  `,

  root: css`
    user-select: none;
    position: relative;
    filter: drop-shadow(0 2px 8px rgb(0 0 0 / 12%));
  `,

  viewport: css`
    --lobe-popover-viewport-inline-padding: 12px;
    --lobe-popover-content-shift: 8px;
    --lobe-popover-content-blur: 4px;

    position: relative;
    overflow: clip;
    padding-block: 12px;
    padding-inline: var(--lobe-popover-viewport-inline-padding);

    /* Old and new content overlap in one clip box while the box morphs; blurring both layers
       during the crossfade turns the misaligned overlap into a soft smear instead of garbled text. */
    [data-previous],
    [data-current] {
      transform: translateX(0);
      opacity: 1;
      filter: blur(0);
      transition:
        transform var(--lobe-popover-layout-duration) var(--lobe-popover-layout-ease),
        opacity calc(var(--lobe-popover-layout-duration) / 2) var(--lobe-popover-animation-ease-out),
        filter calc(var(--lobe-popover-layout-duration) / 2) var(--lobe-popover-animation-ease-out);
    }

    [data-current] {
      transition-delay:
        0s, calc(var(--lobe-popover-layout-duration) / 6),
        calc(var(--lobe-popover-layout-duration) / 6);
    }

    [data-previous][data-ending-style],
    [data-current][data-starting-style] {
      filter: blur(var(--lobe-popover-content-blur));
    }

    /* Freeze both layers at their own final width so neither re-wraps while the box morphs;
       the viewport clip reveals the new content as the box grows over it. */
    [data-previous] {
      position: absolute;
      inset-block-start: 12px;
      inset-inline-start: var(--lobe-popover-viewport-inline-padding);
      width: calc(var(--popup-width) - var(--lobe-popover-viewport-inline-padding) * 2 - 2px);
    }

    &[data-transitioning] [data-current] {
      width: calc(var(--positioner-width) - var(--lobe-popover-viewport-inline-padding) * 2 - 2px);
    }

    &[data-repop] [data-previous] {
      display: none;
    }

    &[data-repop] [data-current] {
      transition: none;
    }

    &[data-activation-direction~='right'] [data-previous][data-ending-style] {
      transform: translateX(calc(var(--lobe-popover-content-shift) * -1));
      opacity: 0;
    }

    &[data-activation-direction~='right'] [data-current][data-starting-style] {
      transform: translateX(var(--lobe-popover-content-shift));
      opacity: 0;
    }

    &[data-activation-direction~='left'] [data-previous][data-ending-style] {
      transform: translateX(var(--lobe-popover-content-shift));
      opacity: 0;
    }

    &[data-activation-direction~='left'] [data-current][data-starting-style] {
      transform: translateX(calc(var(--lobe-popover-content-shift) * -1));
      opacity: 0;
    }

    &[data-activation-direction~='down'] [data-previous][data-ending-style] {
      transform: translateY(calc(var(--lobe-popover-content-shift) * -1));
      opacity: 0;
    }

    &[data-activation-direction~='down'] [data-current][data-starting-style] {
      transform: translateY(var(--lobe-popover-content-shift));
      opacity: 0;
    }

    &[data-activation-direction~='up'] [data-previous][data-ending-style] {
      transform: translateY(var(--lobe-popover-content-shift));
      opacity: 0;
    }

    &[data-activation-direction~='up'] [data-current][data-starting-style] {
      transform: translateY(calc(var(--lobe-popover-content-shift) * -1));
      opacity: 0;
    }
  `,
}));
