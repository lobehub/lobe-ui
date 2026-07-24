/**
 * Root custom properties beautiful-mermaid reads; everything else in its
 * stylesheet is derived from these via color-mix().
 */
export const MERMAID_ROOT_VARS = [
  '--bg',
  '--fg',
  '--line',
  '--accent',
  '--muted',
  '--surface',
  '--border',
];

const styleBlockPattern = /<style>([\s\S]*?)<\/style>/;

const scopeCssSelectors = (css: string, scope: string): string =>
  css.replaceAll(/(^|})([^{}@]+)\{/g, (_match, tail: string, selectors: string) => {
    const scoped = selectors
      .split(',')
      .map((selector) => selector.trim())
      .filter(Boolean)
      // The generated sheet targets `svg` for the root itself, not a descendant
      .map((selector) => (selector === 'svg' ? scope : `${scope} ${selector}`))
      .join(', ');

    return `${tail}\n${scoped} {`;
  });

/**
 * A <style> element inside inline SVG applies to the whole document, so the
 * generated rules must be scoped to this diagram before being injected. The
 * font @import is dropped because inline rendering would actually issue the
 * Google Fonts request that an <img>-loaded SVG silently blocks, and the bare
 * `text` rule is dropped so page CSS can supply the theme font instead.
 */
export const prepareInlineMermaidSvg = (svg: string, scopeId: string): string => {
  if (!svg) return svg;

  const withId = svg.replace(/<svg\b/, `<svg id="${scopeId}"`);

  return withId.replace(styleBlockPattern, (_match, css: string) => {
    const withoutImports = css.replaceAll(/@import[^;]*;/g, '');
    const withoutFontRule = withoutImports.replaceAll(/(^|})\s*text\s*\{[^{}]*\}/g, '$1');

    return `<style>${scopeCssSelectors(withoutFontRule, `#${scopeId}`)}</style>`;
  });
};

/**
 * Inline SVG resolves `var(--ant-*)` from the page, but a Blob-loaded copy is an
 * isolated document with no access to them, so the root variables are baked in
 * as literal values before serializing for preview or download.
 */
export const toStandaloneSvgString = (element: SVGElement): string => {
  const clone = element.cloneNode(true) as SVGElement;
  const computed = globalThis.getComputedStyle(element);

  for (const name of MERMAID_ROOT_VARS) {
    const value = computed.getPropertyValue(name).trim();
    if (value) clone.style.setProperty(name, value);
  }

  const fontFamily = computed.fontFamily;
  if (fontFamily) clone.style.setProperty('font-family', fontFamily);

  return new XMLSerializer().serializeToString(clone);
};
