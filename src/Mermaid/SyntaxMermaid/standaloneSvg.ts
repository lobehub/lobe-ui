const PELE_VARS = [
  '--pele-bg',
  '--pele-fg',
  '--pele-muted',
  '--pele-line',
  '--pele-surface',
  '--pele-surface-alt',
  '--pele-border',
  '--pele-accent',
  '--pele-critical',
  '--pele-error',
  '--pele-font',
  '--pele-font-mono',
  '--pele-radius',
  ...Array.from({ length: 8 }, (_, index) => `--pele-series-${index + 1}`),
];

// A Blob-loaded copy is an isolated document with no access to the page's theme
// variables, so they are baked in as literal values before serializing.
export const toStandaloneSvgString = (element: SVGElement): string => {
  const clone = element.cloneNode(true) as SVGElement;
  const computed = globalThis.getComputedStyle(element);

  for (const name of PELE_VARS) {
    const value = computed.getPropertyValue(name).trim();
    if (value) clone.style.setProperty(name, value);
  }

  // The diagram is rendered transparent so it inherits the page surface, but a
  // standalone copy has nothing behind it: without an explicit fill the viewer
  // scrim (and whatever it lets through) shows straight through the diagram.
  const background = computed.getPropertyValue('--pele-bg').trim();
  if (background) clone.style.setProperty('background', background);

  return new XMLSerializer().serializeToString(clone);
};
