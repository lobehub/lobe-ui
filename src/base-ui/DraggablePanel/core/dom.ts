export const isRtl = (element: Element | null) =>
  !!element && getComputedStyle(element).direction === 'rtl';

let locks = 0;
let saved: Partial<CSSStyleDeclaration> = {};

export const lockBody = (cursor: string, onEscape: () => void) => {
  const { style } = document.body;
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape();
    }
  };

  if (locks === 0) {
    saved = {
      cursor: style.cursor,
      userSelect: style.userSelect,
      webkitUserSelect: style.webkitUserSelect,
    };
  }
  locks += 1;
  Object.assign(style, { cursor, userSelect: 'none', webkitUserSelect: 'none' });
  addEventListener('keydown', onKeyDown, true);

  return () => {
    locks -= 1;
    if (locks === 0) Object.assign(style, saved);
    removeEventListener('keydown', onKeyDown, true);
  };
};
