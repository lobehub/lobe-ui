export const isElementHidden = (el?: HTMLElement | null) => {
  if (!el) return true;
  if (!el.isConnected) return true;
  return el.getClientRects().length === 0;
};

export const observeElementVisibility = (el: HTMLElement, onChange: (visible: boolean) => void) => {
  const update = () => onChange(!isElementHidden(el));

  update();

  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
  resizeObserver?.observe(el);

  const mutationObserver =
    typeof MutationObserver !== 'undefined' ? new MutationObserver(update) : null;

  if (mutationObserver) {
    const options = { attributeFilter: ['style', 'class', 'hidden'], attributes: true };
    let node: HTMLElement | null = el;
    while (node) {
      mutationObserver.observe(node, options);
      node = node.parentElement;
    }
  }

  return () => {
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
  };
};
