export const isItemVisible = (el: HTMLElement): boolean => {
  if (typeof el.checkVisibility === 'function') {
    return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  }
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
  }
  return true;
};

export const hasSize = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

export const isTextInputTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName);
};

export const hasModifier = (event: KeyboardEvent) => event.metaKey || event.ctrlKey || event.altKey;

export const scopeSelector = (id: string) => `[data-focus-scope="${id.replaceAll('"', '\\"')}"]`;
