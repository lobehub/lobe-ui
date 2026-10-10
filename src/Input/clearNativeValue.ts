export const clearNativeValue = (element: HTMLInputElement | HTMLTextAreaElement | null) => {
  if (!element) return;
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(element, '');
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.focus();
};
