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

    transition: inset-inline-start var(--lobe-popover-animation-duration) var(--lobe-popover-animation-ease-out);

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

    width: var(--popup-width, auto);
    min-width: 120px;
    height: var(--popup-height, auto);
    border-radius: ${cssVar.borderRadius};

    color: ${cssVar.colorText};

    background: ${cssVar.colorBgElevated};
    outline: none;
    box-shadow:
      0 0 15px 0 #00000008,
      0 2px 30px 0 #00000014,
      0 0 0 1px ${cssVar.colorBorder} inset;

    transition-timing-function: var(--lobe-popover-animation-ease-out);
    transition-duration: var(--lobe-popover-animation-duration);
    transition-property: width, height, opacity, transform;

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

    z-index: 1100;

    width: var(--positioner-width);
    max-width: var(--available-width);
    height: var(--positioner-height);

    transition-timing-function: var(--lobe-popover-animation-ease-out);
    transition-duration: var(--lobe-popover-animation-duration);
    transition-property: inset-block-start, inset-inline-start, inset-inline-end, inset-block-end, transform;

    &[data-instant] {
      transition: none;
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
  `,

  root: css`
    user-select: none;
    position: relative;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 12%));
  `,

  viewport: css`
    --lobe-popover-viewport-inline-padding: 12px;

    position: relative;

    overflow: clip;

    width: 100%;
    height: 100%;
    padding-block: 12px;
    padding-inline: var(--lobe-popover-viewport-inline-padding);

    [data-previous],
    [data-current] {
      transform: translateX(0);
      width: calc(var(--popup-width) - 2 * var(--lobe-popover-viewport-inline-padding));
      opacity: 1;
      transition:
        transform var(--lobe-popover-animation-duration) var(--lobe-popover-animation-ease-out),
        opacity calc(var(--lobe-popover-animation-duration) / 2)
          var(--lobe-popover-animation-ease-out);
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
