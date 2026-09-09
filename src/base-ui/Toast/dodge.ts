export const TOAST_WIDTH = 360;
export const TOAST_MIN_WIDTH = 260;
export const TOAST_EDGE = 16;
export const TOAST_ROW_HEIGHT = 88;
export const TOAST_DODGE_GUTTER = 12;

// Spring baked as linear(): stiffness 460 / damping 53 / mass 2.3, zeta ~0.81
// with 1.2% overshoot. The duration is the spring's settle time — change them
// together with the curve, not independently.
export const TOAST_DODGE_DURATION = '608ms';
export const TOAST_DODGE_EASE =
  'linear(0, 0.08, 0.249, 0.437, 0.607, 0.745, 0.847, 0.917, 0.963, 0.99, 1.004, 1.011, 1.012, 1.011, 1.009, 1.007, 1.005, 1.003, 1.002, 1)';

export const TOAST_SHIFT_X_VAR = '--toast-shift-x';
export const TOAST_SHIFT_Y_VAR = '--toast-shift-y';
export const TOAST_WIDTH_VAR = '--toast-width';
export const PANEL_RESERVE_VAR = '--floating-panel-reserve-block-end';
export const PANEL_ALIGN_INLINE_VAR = '--floating-panel-reserve-inline-end';

export interface ToastDodgeInput {
  panelHeight: number;
  panelOffsetX: number;
  panelOffsetY: number;
  panelWidth: number;
  viewportHeight: number;
  viewportWidth: number;
}

export type ToastDodgeMode = 'left' | 'reserve' | 'shrink' | 'up';

export interface ToastDodgeResult {
  alignInline: number;
  mode: ToastDodgeMode;
  reserve: number;
  shiftX: number;
  shiftY: number;
  width: number;
}

export const resolveToastDodge = ({
  panelHeight,
  panelOffsetX,
  panelOffsetY,
  panelWidth,
  viewportHeight,
  viewportWidth,
}: ToastDodgeInput): ToastDodgeResult => {
  const shiftX = Math.max(0, panelWidth + panelOffsetX + TOAST_DODGE_GUTTER - TOAST_EDGE);
  const shiftY = Math.max(0, panelHeight + panelOffsetY + TOAST_DODGE_GUTTER - TOAST_EDGE);
  const lane = viewportWidth - shiftX - TOAST_EDGE * 2;
  const headroom = viewportHeight - shiftY - TOAST_EDGE * 2;

  // The panel sits closer to the edge than the toast does, so the pair reads as
  // misaligned until the panel is pushed out to the toast's inset. Which axis
  // needs it follows which edge the two end up sharing.
  const alignBlock = Math.max(0, TOAST_EDGE - panelOffsetY);
  const alignInline = Math.max(0, TOAST_EDGE - panelOffsetX);

  if (lane >= TOAST_WIDTH) {
    return {
      alignInline: 0,
      mode: 'left',
      reserve: alignBlock,
      shiftX,
      shiftY: 0,
      width: TOAST_WIDTH,
    };
  }

  if (headroom >= TOAST_ROW_HEIGHT) {
    return { alignInline, mode: 'up', reserve: 0, shiftX: 0, shiftY, width: TOAST_WIDTH };
  }

  if (lane >= TOAST_MIN_WIDTH) {
    return { alignInline: 0, mode: 'shrink', reserve: alignBlock, shiftX, shiftY: 0, width: lane };
  }

  // ponytail: the reserve budget is one toast row, not the live stack height —
  // measuring the stack would feed panel resizes back into the measurement.
  // A taller stack overflows upward here; per-stack reserve if that shows up.
  return {
    alignInline,
    mode: 'reserve',
    reserve: Math.max(0, TOAST_EDGE + TOAST_ROW_HEIGHT + TOAST_DODGE_GUTTER - panelOffsetY),
    shiftX: 0,
    shiftY: 0,
    width: TOAST_WIDTH,
  };
};
