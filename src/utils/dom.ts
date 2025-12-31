export const preventDefault = <
  T extends {
    preventDefault: () => void;
  },
>(
  event: T,
) => {
  event.preventDefault();
};

export const stopPropagation = <
  T extends {
    stopPropagation: () => void;
  },
>(
  event: T,
) => {
  event.stopPropagation();
};

export const preventDefaultAndStopPropagation = <
  T extends {
    preventBaseUIHandler?: () => void;
    preventDefault: () => void;
    stopPropagation: () => void;
  },
>(
  event: T,
) => {
  event.preventDefault();
  event.stopPropagation();
  event.preventBaseUIHandler?.();
};
