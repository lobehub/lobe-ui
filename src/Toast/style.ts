import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  action: css`
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: 28px;
    margin-block-start: 8px;
    padding-inline: 12px;
    border: none;
    border-radius: ${cssVar.borderRadiusSM};

    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    color: ${cssVar.colorTextLightSolid};

    background: ${cssVar.colorPrimary};

    transition: background 0.2s;

    &:hover {
      background: ${cssVar.colorPrimaryHover};
    }

    &:active {
      background: ${cssVar.colorPrimaryActive};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }
  `,

  close: css`
    cursor: pointer;

    position: absolute;
    inset-block-start: 8px;
    inset-inline-end: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition: all 0.2s;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }
  `,

  content: css`
    overflow: hidden;
    transition: opacity 0.2s;

    &[data-behind] {
      pointer-events: none;
      opacity: 0;
    }

    &[data-expanded] {
      pointer-events: auto;
      opacity: 1;
    }
  `,

  description: css`
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: ${cssVar.colorTextSecondary};
  `,

  icon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  `,

  root: css`
    --toast-gap: 12px;
    --toast-peek: 12px;
    --toast-scale: calc(1 - var(--toast-index) * 0.05);
    --toast-shrink: calc(1 - var(--toast-scale));
    --toast-collapsed-height: var(--toast-frontmost-height, var(--toast-height));

    cursor: default;
    user-select: none;

    position: absolute;
    z-index: calc(1000 - var(--toast-index));
    inset-inline: 0;

    box-sizing: border-box;
    width: 100%;
    height: var(--toast-collapsed-height);
    padding-block: 12px;
    padding-inline: 16px;
    padding-inline-end: 32px;
    border-radius: ${cssVar.borderRadiusLG};

    color: ${cssVar.colorText};

    background: ${cssVar.colorBgElevated};
    background-clip: padding-box;
    box-shadow:
      0 0 0 1px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 1px 1px -0.5px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 3px 3px -1.5px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 6px 6px -3px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 12px 12px -6px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 24px 24px -12px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent);

    transition:
      transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.4s,
      height 0.15s;

    /* Fill gap between stacked toasts to prevent hover flicker */
    &::after {
      content: '';
      position: absolute;
      inset-inline: 0;
      height: calc(var(--toast-gap) + var(--toast-peek) + 8px);
    }

    &[data-limited] {
      opacity: 0;
    }

    &[data-swiping] {
      transition: none;
    }
  `,

  // Bottom positions - stack upward
  rootBottom: css`
    inset-block: auto 0;
    transform-origin: bottom center;
    transform: translateX(var(--toast-swipe-movement-x))
      translateY(
        calc(
          var(--toast-swipe-movement-y) - (var(--toast-index) * var(--toast-peek)) -
            (var(--toast-shrink) * var(--toast-collapsed-height))
        )
      )
      scale(var(--toast-scale));

    &::after {
      inset-block-start: 100%;
    }

    &[data-expanded] {
      transform: translateX(var(--toast-swipe-movement-x))
        translateY(
          calc(
            var(--toast-swipe-movement-y) + var(--toast-offset-y) * -1 + var(--toast-index) *
              var(--toast-gap) * -1
          )
        )
        scale(1);
      height: var(--toast-height);
    }

    &[data-starting-style],
    &[data-ending-style] {
      transform: translateY(150%);
      opacity: 0;
    }
  `,

  // Top positions - stack downward
  rootTop: css`
    inset-block: 0 auto;
    transform-origin: top center;
    transform: translateX(var(--toast-swipe-movement-x))
      translateY(
        calc(
          var(--toast-swipe-movement-y) + (var(--toast-index) * var(--toast-peek)) +
            (var(--toast-shrink) * var(--toast-collapsed-height))
        )
      )
      scale(var(--toast-scale));

    &::after {
      inset-block-end: 100%;
    }

    &[data-expanded] {
      transform: translateX(var(--toast-swipe-movement-x))
        translateY(
          calc(
            var(--toast-swipe-movement-y) + var(--toast-offset-y) + var(--toast-index) *
              var(--toast-gap)
          )
        )
        scale(1);
      height: var(--toast-height);
    }

    &[data-starting-style],
    &[data-ending-style] {
      transform: translateY(-150%);
      opacity: 0;
    }
  `,

  title: css`
    margin: 0;

    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: ${cssVar.colorText};
  `,

  toastBody: css`
    display: flex;
    gap: 12px;
    align-items: flex-start;
  `,

  viewport: css`
    position: fixed;
    z-index: 1100;

    width: 360px;
    max-width: calc(100vw - 32px);

    outline: 0;

    @media (width <= 480px) {
      width: calc(100vw - 32px);
    }
  `,

  viewportBottom: css`
    inset-block-end: 16px;
    inset-inline-start: 50%;
    transform: translateX(-50%);
  `,

  viewportBottomLeft: css`
    inset-block-end: 16px;
    inset-inline-start: 16px;
  `,

  viewportBottomRight: css`
    inset-block-end: 16px;
    inset-inline-end: 16px;
  `,

  viewportTop: css`
    inset-block-start: 16px;
    inset-inline-start: 50%;
    transform: translateX(-50%);
  `,

  viewportTopLeft: css`
    inset-block-start: 16px;
    inset-inline-start: 16px;
  `,

  viewportTopRight: css`
    inset-block-start: 16px;
    inset-inline-end: 16px;
  `,
}));

export const viewportVariants = cva(styles.viewport, {
  defaultVariants: {
    position: 'bottom-right',
  },
  variants: {
    position: {
      'bottom': styles.viewportBottom,
      'bottom-left': styles.viewportBottomLeft,
      'bottom-right': styles.viewportBottomRight,
      'top': styles.viewportTop,
      'top-left': styles.viewportTopLeft,
      'top-right': styles.viewportTopRight,
    },
  },
});

export const rootVariants = cva(styles.root, {
  defaultVariants: {
    position: 'bottom-right',
  },
  variants: {
    position: {
      'bottom': styles.rootBottom,
      'bottom-left': styles.rootBottom,
      'bottom-right': styles.rootBottom,
      'top': styles.rootTop,
      'top-left': styles.rootTop,
      'top-right': styles.rootTop,
    },
  },
});
