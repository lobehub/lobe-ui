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
      fill: ${cssVar.colorText};
    }

    & [data-role='stroke'] {
      stroke: none;
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
    user-select: none;

    position: relative;
    transform-origin: var(--transform-origin);

    max-width: min(320px, var(--available-width));
    border-radius: ${cssVar.borderRadiusSM};

    font-size: 12px;
    line-height: 1.2;
    color: ${cssVar.colorBgLayout};

    background: ${cssVar.colorText};

    transition-timing-function: var(--lobe-tooltip-animation-ease-out);
    transition-duration: var(--lobe-tooltip-animation-duration);
    transition-property: opacity, transform;

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
    --lobe-tooltip-animation-duration: 120ms;
    --lobe-tooltip-animation-duration-exit: 80ms;
    --lobe-tooltip-animation-translate: 4px;
    --lobe-tooltip-animation-scale: 0.96;
    --lobe-tooltip-animation-ease-in: ease-in;
    --lobe-tooltip-animation-ease-out: ${cssVar.motionEaseOut};
    --lobe-tooltip-translate-x: 0;
    --lobe-tooltip-translate-y: calc(var(--lobe-tooltip-animation-translate) * -1);

    z-index: 1100;

    width: var(--positioner-width);
    max-width: var(--available-width);
    height: var(--positioner-height);

    transition-timing-function: var(--lobe-tooltip-animation-ease-out);
    transition-duration: var(--lobe-tooltip-animation-duration);
    transition-property:
      inset-block-start, inset-inline-start, inset-inline-end, inset-block-end, transform;

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
  `,

  viewport: css`
    --lobe-tooltip-viewport-inline-padding: 8px;

    position: relative;

    overflow: clip;
    display: flex;
    gap: 6px;
    align-items: center;

    max-width: min(320px, var(--available-width));
    padding-block: 4px;
    padding-inline: var(--lobe-tooltip-viewport-inline-padding);

    word-break: break-word;
    white-space: normal;

    [data-previous],
    [data-current] {
      transform: translateX(0);

      display: flex;
      gap: 6px;
      align-items: center;

      opacity: 1;

      transition:
        transform var(--lobe-tooltip-animation-duration) var(--lobe-tooltip-animation-ease-out),
        opacity calc(var(--lobe-tooltip-animation-duration) / 2)
          var(--lobe-tooltip-animation-ease-out);
    }

    &[data-activation-direction~='right'] [data-previous][data-ending-style] {
      transform: translateX(-50%);
      opacity: 0;
    }

    &[data-activation-direction~='right'] [data-current][data-starting-style] {
      transform: translateX(50%);
      opacity: 0;
    }

    &[data-activation-direction~='left'] [data-previous][data-ending-style] {
      transform: translateX(50%);
      opacity: 0;
    }

    &[data-activation-direction~='left'] [data-current][data-starting-style] {
      transform: translateX(-50%);
      opacity: 0;
    }

    &[data-activation-direction~='down'] [data-previous][data-ending-style] {
      transform: translateY(-50%);
      opacity: 0;
    }

    &[data-activation-direction~='down'] [data-current][data-starting-style] {
      transform: translateY(50%);
      opacity: 0;
    }

    &[data-activation-direction~='up'] [data-previous][data-ending-style] {
      transform: translateY(50%);
      opacity: 0;
    }

    &[data-activation-direction~='up'] [data-current][data-starting-style] {
      transform: translateY(-50%);
      opacity: 0;
    }
  `,
}));
