const media = (query: string) => {
  let list: MediaQueryList | undefined;
  const get = () => {
    list ??= typeof matchMedia === 'function' ? matchMedia(query) : undefined;
    return list;
  };

  return {
    get: () => get()?.matches ?? false,
    subscribe: (listener: () => void) => {
      get()?.addEventListener('change', listener);
      return () => get()?.removeEventListener('change', listener);
    },
  };
};

export const coarsePointer = media('(pointer: coarse)');
export const reducedMotion = media('(prefers-reduced-motion: reduce)');

const HANDLE_SIZE_FINE = 8;
const HANDLE_SIZE_WIDE = 16;
const HANDLE_SIZE_COARSE = 20;

export const handleSize = (wide = true) => {
  if (coarsePointer.get()) return HANDLE_SIZE_COARSE;
  return wide ? HANDLE_SIZE_WIDE : HANDLE_SIZE_FINE;
};
