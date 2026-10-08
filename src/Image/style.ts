import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { actualSizeMarker, imageMarker } from './marker.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

// Bare viewer controls float directly over arbitrary image content; the
// theme-side halo (light halo around dark icons in light mode and vice
// versa) is what keeps them readable without a container panel.
const controlHalo = `drop-shadow(0 0 2px ${cssVar.colorBgLayout}) drop-shadow(0 1px 6px ${cssVar.colorBgLayout})`;

export const styles = stylex.create({
  actions: {
    cursor: 'pointer',
    insetBlockStart: 0,
    insetInlineEnd: 0,
    position: 'absolute',
    zIndex: 1,
  },
  actionsHidden: {
    opacity: { default: 0, [stylex.when.ancestor(':hover', imageMarker)]: 1 },
  },
  actualSizeCorner: {
    transition: {
      default: `transform 300ms ${cssVar.motionEaseInOut}`,
      [reducedMotion]: 'none',
    },
    transform: {
      default: null,
      [stylex.when.ancestor('[data-actual-size="fit"]', actualSizeMarker)]: 'rotate(180deg)',
    },
    // view-box, so the per-corner transform-origin is read in the 24x24 user
    // space the path coordinates are written in rather than the rendered pixel box.
    transformBox: 'view-box',
  },
  filled: {
    borderColor: cssVar.colorBorderSecondary,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorFillTertiary,
  },
  image: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    height: 'auto',
    width: 'auto',
  },
  previewable: {
    cursor: 'zoom-in',
  },
  root: {
    borderRadius: cssVar.borderRadius,
    overflow: 'hidden',
    cursor: 'pointer',
    lineHeight: 1,
    position: 'relative',
    userSelect: 'none',
    width: 'fit-content',
  },
  toolbar: {
    insetBlockEnd: 16,
    insetInlineStart: '50%',
    pointerEvents: 'auto',
    position: 'absolute',
    transform: 'translateX(-50%)',
  },
  // Fixed, not min-width: this is a readout that changes digit count as it
  // zooms (9% → 100% → 800%), and letting it size to content shifts every
  // control beside it on each wheel tick. Wide enough for four digits.
  toolbarPercentage: {
    color: cssVar.colorTextTertiary,
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
    height: 36,
    width: 56,
  },
  // The glass lives on the icon row, not the toolbar itself: tooltips and
  // the more-menu portal into the toolbar element, and an ancestor
  // backdrop-filter/filter would distort those popups too.
  toolbarRow: {
    borderRadius: 999,
    paddingBlock: 4,
    paddingInline: 6,
    backdropFilter: 'blur(12px)',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgLayout} 60%, transparent)`,
  },
  viewerBackdrop: {
    inset: 0,
    backdropFilter: 'blur(8px)',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgLayout} 90%, transparent)`,
    opacity: 0,
    position: 'fixed',
  },
  viewerChrome: {
    inset: 0,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  viewerChromeIdle: {
    inset: 0,
    transition: {
      default: `opacity 200ms ${cssVar.motionEaseOut}, visibility 200ms`,
      [reducedMotion]: 'none',
    },
    opacity: { 'default': null, ':is([data-idle-hidden])': 0 },
    pointerEvents: 'none',
    position: 'absolute',
    visibility: { 'default': null, ':is([data-idle-hidden])': 'hidden' },
  },
  viewerClose: {
    filter: controlHalo,
    insetBlockStart: 16,
    insetInlineEnd: 16,
    pointerEvents: 'auto',
    position: 'absolute',
  },
  viewerCounter: {
    borderRadius: 999,
    paddingBlock: 4,
    paddingInline: 12,
    backdropFilter: 'blur(12px)',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgLayout} 60%, transparent)`,
    color: cssVar.colorTextSecondary,
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    insetBlockStart: 16,
    insetInlineStart: '50%',
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translateX(-50%)',
  },
  viewerImage: {
    cursor: 'zoom-out',
    objectFit: 'contain',
    position: 'absolute',
    transformOrigin: 'center center',
    userSelect: 'none',
    willChange: 'transform',
  },
  viewerNavButton: {
    filter: controlHalo,
    insetBlockStart: '50%',
    pointerEvents: 'auto',
    position: 'absolute',
    transform: 'translateY(-50%)',
  },
  viewerNavNext: {
    insetInlineEnd: 16,
  },
  viewerNavPrev: {
    insetInlineStart: 16,
  },
  viewerPopup: {
    inset: 0,
    outline: 'none',
    overflow: 'hidden',
    position: 'fixed',
  },
  wrapper: {
    overflow: 'hidden',
    position: 'relative',
    height: 'auto',
    maxWidth: '100%',
  },
});

export const FALLBACK_DARK =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjM0IzQjNCIi8+CjxwYXRoIGQ9Ik0xNTYuODg4IDkxLjAwMkgxMDAuMTEyQzk1LjYzMjkgOTEuMDAyIDkyLjAwMTUgOTQuNjMzNCA5Mi4wMDE1IDk5LjExMjdWMTU1Ljg4OEM5Mi4wMDE1IDE2MC4zNjcgOTUuNjMyOSAxNjMuOTk5IDEwMC4xMTIgMTYzLjk5OUgxNTYuODg4QzE2MS4zNjcgMTYzLjk5OSAxNjQuOTk4IDE2MC4zNjcgMTY0Ljk5OCAxNTUuODg4Vjk5LjExMjdDMTY0Ljk5OCA5NC42MzM0IDE2MS4zNjcgOTEuMDAyIDE1Ni44ODggOTEuMDAyWiIgc3Ryb2tlPSIjNjI2MjYyIiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTY0Ljk5OCAxMzkuNjY4TDE1Mi40ODQgMTI3LjE1M0MxNTAuOTYyIDEyNS42MzIgMTQ4LjkgMTI0Ljc3OCAxNDYuNzQ5IDEyNC43NzhDMTQ0LjU5OSAxMjQuNzc4IDE0Mi41MzYgMTI1LjYzMiAxNDEuMDE1IDEyNy4xNTNMMTA0LjE2OCAxNjRNMTE2LjMzNCAxMjMuNDQ1QzEyMC44MTMgMTIzLjQ0NSAxMjQuNDQ1IDExOS44MTQgMTI0LjQ0NSAxMTUuMzM0QzEyNC40NDUgMTEwLjg1NSAxMjAuODEzIDEwNy4yMjQgMTE2LjMzNCAxMDcuMjI0QzExMS44NTUgMTA3LjIyNCAxMDguMjIzIDExMC44NTUgMTA4LjIyMyAxMTUuMzM0QzEwOC4yMjMgMTE5LjgxNCAxMTEuODU1IDEyMy40NDUgMTE2LjMzNCAxMjMuNDQ1WiIgc3Ryb2tlPSIjNjI2MjYyIiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
export const FALLBACK_LIGHT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRUNFQ0VDIi8+CjxwYXRoIGQ9Ik0xNTYuODg4IDkxLjAwMkgxMDAuMTEyQzk1LjYzMjkgOTEuMDAyIDkyLjAwMTUgOTQuNjMzNCA5Mi4wMDE1IDk5LjExMjdWMTU1Ljg4OEM5Mi4wMDE1IDE2MC4zNjcgOTUuNjMyOSAxNjMuOTk5IDEwMC4xMTIgMTYzLjk5OUgxNTYuODg4QzE2MS4zNjcgMTYzLjk5OSAxNjQuOTk4IDE2MC4zNjcgMTY0Ljk5OCAxNTUuODg4Vjk5LjExMjdDMTY0Ljk5OCA5NC42MzM0IDE2MS4zNjcgOTEuMDAyIDE1Ni44ODggOTEuMDAyWiIgc3Ryb2tlPSIjRDdEN0Q3IiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTY0Ljk5OCAxMzkuNjY4TDE1Mi40ODQgMTI3LjE1M0MxNTAuOTYyIDEyNS42MzIgMTQ4LjkgMTI0Ljc3OCAxNDYuNzQ5IDEyNC43NzhDMTQ0LjU5OSAxMjQuNzc4IDE0Mi41MzYgMTI1LjYzMiAxNDEuMDE1IDEyNy4xNTNMMTA0LjE2OCAxNjRNMTE2LjMzNCAxMjMuNDQ1QzEyMC44MTMgMTIzLjQ0NSAxMjQuNDQ1IDExOS44MTQgMTI0LjQ0NSAxMTUuMzM0QzEyNC40NDUgMTEwLjg1NSAxMjAuODEzIDEwNy4yMjQgMTE2LjMzNCAxMDcuMjI0QzExMS44NTUgMTA3LjIyNCAxMDguMjIzIDExMC44NTUgMTA4LjIyMyAxMTUuMzM0QzEwOC4yMjMgMTE5LjgxNCAxMTEuODU1IDEyMy40NDUgMTE2LjMzNCAxMjMuNDQ1WiIgc3Ryb2tlPSIjRDdEN0Q3IiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
