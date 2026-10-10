import { type LayerTier, Z_INDEX_LAYER } from './constants';

let mainTop = 0;
let toastTop = 0;
let warnedMainOverflow = false;

export function acquireLayerZIndex(tier: LayerTier): number {
  if (tier === 'toast') {
    toastTop = Math.max(toastTop, Z_INDEX_LAYER.toast) + Z_INDEX_LAYER.step;
    return toastTop;
  }
  mainTop = Math.max(mainTop, Z_INDEX_LAYER[tier]) + Z_INDEX_LAYER.step;
  if (
    process.env.NODE_ENV !== 'production' &&
    !warnedMainOverflow &&
    mainTop >= Z_INDEX_LAYER.toast
  ) {
    warnedMainOverflow = true;

    console.warn(
      `[lobe-ui z-index] main stack reached toast tier (${mainTop}); unexpected nesting depth`,
    );
  }
  return mainTop;
}

export function __resetLayerZIndexForTests(): void {
  mainTop = 0;
  toastTop = 0;
  warnedMainOverflow = false;
}

export function __seedMainTopForTests(value: number): void {
  mainTop = value;
}
