export const stubMatchMedia = () => {
  if (typeof window.matchMedia === 'function') return;
  window.matchMedia = ((query: string) => ({
    addEventListener: () => {},
    addListener: () => {},
    dispatchEvent: () => false,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: () => {},
    removeListener: () => {},
  })) as typeof window.matchMedia;
};
