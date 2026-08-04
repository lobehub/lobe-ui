import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  // Bare viewer controls float directly over arbitrary image content; the
  // theme-side halo (light halo around dark icons in light mode and vice
  // versa) is what keeps them readable without a container panel.
  const controlHalo = `drop-shadow(0 0 2px ${cssVar.colorBgLayout}) drop-shadow(0 1px 6px ${cssVar.colorBgLayout})`;
  return {
    actionsHidden: css`
      cursor: pointer;

      position: absolute;
      z-index: 1;
      inset-block-start: 0;
      inset-inline-end: 0;

      opacity: 0;
    `,
    actionsVisible: css`
      cursor: pointer;

      position: absolute;
      z-index: 1;
      inset-block-start: 0;
      inset-inline-end: 0;

      opacity: 1;
    `,
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    filled: css`
      ${lobeStaticStylish.variantOutlinedWithoutHover};
      ${lobeStaticStylish.variantFilledWithoutHover};
    `,
    image: css`
      display: flex;
      align-items: center;
      justify-content: center;

      width: auto;
      height: auto;
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    previewable: css`
      cursor: zoom-in;
    `,
    root: css`
      cursor: pointer;
      user-select: none;

      position: relative;

      overflow: hidden;

      width: fit-content;
      border-radius: ${cssVar.borderRadius};

      line-height: 1;

      &:hover {
        .actions-hidden {
          opacity: 1;
        }
      }
    `,
    toolbar: css`
      pointer-events: auto;

      position: absolute;
      inset-block-end: 16px;
      inset-inline-start: 50%;
      transform: translateX(-50%);
    `,
    // The glass lives on the icon row, not the toolbar itself: tooltips and
    // the more-menu portal into the toolbar element, and an ancestor
    // backdrop-filter/filter would distort those popups too.
    toolbarRow: css`
      padding-block: 4px;
      padding-inline: 6px;
      border-radius: 999px;

      background: color-mix(in srgb, ${cssVar.colorBgLayout} 60%, transparent);
      backdrop-filter: blur(12px);
    `,
    actualSizeCorner: css`
      /* view-box, so the per-corner transform-origin below is read in the 24x24
         user space the path coordinates are written in rather than the rendered
         pixel box. */
      transform-box: view-box;
      transition: transform 300ms ${cssVar.motionEaseInOut};

      [data-actual-size='fit'] & {
        transform: rotate(180deg);
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `,

    toolbarPercentage: css`
      user-select: none;

      /* Fixed, not min-width: this is a readout that changes digit count as it
         zooms (9% → 100% → 800%), and letting it size to content shifts every
         control beside it on each wheel tick. Wide enough for four digits. */
      width: 56px;
      height: 36px;

      font-size: 12px;
      font-variant-numeric: tabular-nums;
      color: ${cssVar.colorTextTertiary};
    `,

    viewerBackdrop: css`
      position: fixed;
      inset: 0;

      opacity: 0;
      background: color-mix(in srgb, ${cssVar.colorBgLayout} 90%, transparent);
      backdrop-filter: blur(8px);
    `,
    viewerChrome: css`
      pointer-events: none;
      position: absolute;
      inset: 0;
      opacity: 0;
    `,
    viewerChromeIdle: css`
      pointer-events: none;
      position: absolute;
      inset: 0;
      transition:
        opacity 200ms ${cssVar.motionEaseOut},
        visibility 200ms;

      &[data-idle-hidden] {
        visibility: hidden;
        opacity: 0;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `,
    viewerClose: css`
      pointer-events: auto;

      position: absolute;
      inset-block-start: 16px;
      inset-inline-end: 16px;

      filter: ${controlHalo};
    `,
    viewerCounter: css`
      pointer-events: none;

      position: absolute;
      inset-block-start: 16px;
      inset-inline-start: 50%;
      transform: translateX(-50%);

      padding-block: 4px;
      padding-inline: 12px;
      border-radius: 999px;

      font-size: 12px;
      font-variant-numeric: tabular-nums;
      color: ${cssVar.colorTextSecondary};

      background: color-mix(in srgb, ${cssVar.colorBgLayout} 60%, transparent);
      backdrop-filter: blur(12px);
    `,
    viewerImage: css`
      will-change: transform;
      cursor: zoom-out;
      user-select: none;

      position: absolute;
      transform-origin: center center;

      object-fit: contain;

      -webkit-user-drag: none;
    `,
    viewerNavButton: css`
      pointer-events: auto;

      position: absolute;
      inset-block-start: 50%;
      transform: translateY(-50%);

      filter: ${controlHalo};
    `,
    viewerNavNext: css`
      inset-inline-end: 16px;
    `,
    viewerNavPrev: css`
      inset-inline-start: 16px;
    `,
    viewerPopup: css`
      position: fixed;
      inset: 0;
      overflow: hidden;
      outline: none;
    `,
    wrapper: css`
      position: relative;
      overflow: hidden;
      max-width: 100%;
      height: auto;
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    variant: 'filled',
  },

  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
  },
});

export const FALLBACK_DARK =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjM0IzQjNCIi8+CjxwYXRoIGQ9Ik0xNTYuODg4IDkxLjAwMkgxMDAuMTEyQzk1LjYzMjkgOTEuMDAyIDkyLjAwMTUgOTQuNjMzNCA5Mi4wMDE1IDk5LjExMjdWMTU1Ljg4OEM5Mi4wMDE1IDE2MC4zNjcgOTUuNjMyOSAxNjMuOTk5IDEwMC4xMTIgMTYzLjk5OUgxNTYuODg4QzE2MS4zNjcgMTYzLjk5OSAxNjQuOTk4IDE2MC4zNjcgMTY0Ljk5OCAxNTUuODg4Vjk5LjExMjdDMTY0Ljk5OCA5NC42MzM0IDE2MS4zNjcgOTEuMDAyIDE1Ni44ODggOTEuMDAyWiIgc3Ryb2tlPSIjNjI2MjYyIiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTY0Ljk5OCAxMzkuNjY4TDE1Mi40ODQgMTI3LjE1M0MxNTAuOTYyIDEyNS42MzIgMTQ4LjkgMTI0Ljc3OCAxNDYuNzQ5IDEyNC43NzhDMTQ0LjU5OSAxMjQuNzc4IDE0Mi41MzYgMTI1LjYzMiAxNDEuMDE1IDEyNy4xNTNMMTA0LjE2OCAxNjRNMTE2LjMzNCAxMjMuNDQ1QzEyMC44MTMgMTIzLjQ0NSAxMjQuNDQ1IDExOS44MTQgMTI0LjQ0NSAxMTUuMzM0QzEyNC40NDUgMTEwLjg1NSAxMjAuODEzIDEwNy4yMjQgMTE2LjMzNCAxMDcuMjI0QzExMS44NTUgMTA3LjIyNCAxMDguMjIzIDExMC44NTUgMTA4LjIyMyAxMTUuMzM0QzEwOC4yMjMgMTE5LjgxNCAxMTEuODU1IDEyMy40NDUgMTE2LjMzNCAxMjMuNDQ1WiIgc3Ryb2tlPSIjNjI2MjYyIiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
export const FALLBACK_LIGHT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRUNFQ0VDIi8+CjxwYXRoIGQ9Ik0xNTYuODg4IDkxLjAwMkgxMDAuMTEyQzk1LjYzMjkgOTEuMDAyIDkyLjAwMTUgOTQuNjMzNCA5Mi4wMDE1IDk5LjExMjdWMTU1Ljg4OEM5Mi4wMDE1IDE2MC4zNjcgOTUuNjMyOSAxNjMuOTk5IDEwMC4xMTIgMTYzLjk5OUgxNTYuODg4QzE2MS4zNjcgMTYzLjk5OSAxNjQuOTk4IDE2MC4zNjcgMTY0Ljk5OCAxNTUuODg4Vjk5LjExMjdDMTY0Ljk5OCA5NC42MzM0IDE2MS4zNjcgOTEuMDAyIDE1Ni44ODggOTEuMDAyWiIgc3Ryb2tlPSIjRDdEN0Q3IiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTY0Ljk5OCAxMzkuNjY4TDE1Mi40ODQgMTI3LjE1M0MxNTAuOTYyIDEyNS42MzIgMTQ4LjkgMTI0Ljc3OCAxNDYuNzQ5IDEyNC43NzhDMTQ0LjU5OSAxMjQuNzc4IDE0Mi41MzYgMTI1LjYzMiAxNDEuMDE1IDEyNy4xNTNMMTA0LjE2OCAxNjRNMTE2LjMzNCAxMjMuNDQ1QzEyMC44MTMgMTIzLjQ0NSAxMjQuNDQ1IDExOS44MTQgMTI0LjQ0NSAxMTUuMzM0QzEyNC40NDUgMTEwLjg1NSAxMjAuODEzIDEwNy4yMjQgMTE2LjMzNCAxMDcuMjI0QzExMS44NTUgMTA3LjIyNCAxMDguMjIzIDExMC44NTUgMTA4LjIyMyAxMTUuMzM0QzEwOC4yMjMgMTE5LjgxNCAxMTEuODU1IDEyMy40NDUgMTE2LjMzNCAxMjMuNDQ1WiIgc3Ryb2tlPSIjRDdEN0Q3IiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
