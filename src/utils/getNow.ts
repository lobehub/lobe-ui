export const getNow = (): number => {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
};
