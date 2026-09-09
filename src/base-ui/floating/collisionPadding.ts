export type FloatingCollisionPadding =
  number | Partial<Record<'bottom' | 'left' | 'right' | 'top', number>>;

const BASE_UI_DEFAULT_PADDING = 5;

let floatingCollisionPadding: FloatingCollisionPadding | undefined;

// Module-level rather than context: it is read at render time by every base-ui positioner,
// so it must be set once at app bootstrap before any floating layer mounts (e.g. reserve the
// Electron title bar). Partial objects keep base-ui's 5px default on the unspecified sides.
export const setFloatingCollisionPadding = (padding?: FloatingCollisionPadding) => {
  floatingCollisionPadding =
    padding !== undefined && typeof padding === 'object'
      ? {
          bottom: BASE_UI_DEFAULT_PADDING,
          left: BASE_UI_DEFAULT_PADDING,
          right: BASE_UI_DEFAULT_PADDING,
          top: BASE_UI_DEFAULT_PADDING,
          ...padding,
        }
      : padding;
};

export const getFloatingCollisionPadding = () => floatingCollisionPadding;
