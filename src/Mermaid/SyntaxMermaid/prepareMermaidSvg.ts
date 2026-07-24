const VOID_ELEMENTS = 'area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr';
const voidElementPattern = new RegExp(`<(${VOID_ELEMENTS})((?:\\s[^>]*?)?)\\s*/?>`, 'gi');

// Mermaid serializes HTML labels (foreignObject) with HTML rules, leaving void elements
// like <br> unclosed. When that SVG string is loaded as a standalone image/svg+xml Blob,
// the browser parses it as strict XML, rejects the unclosed tag, and fails the whole image.
const ensureXmlSafeVoidElements = (svg: string): string =>
  svg.replaceAll(voidElementPattern, '<$1$2/>');

const applyFirefoxSizeFix = (svg: string): string => {
  if (
    typeof window === 'undefined' ||
    typeof navigator === 'undefined' ||
    !navigator.userAgent.includes('Firefox') ||
    typeof DOMParser === 'undefined'
  ) {
    return svg;
  }

  const svgDoc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  if (svgDoc.querySelector('parsererror')) return svg;

  const svgElement = svgDoc.documentElement;
  if (!svgElement || svgElement.localName !== 'svg' || !svgElement.hasAttribute('viewBox')) {
    return svg;
  }

  const viewBoxParts = svgElement.getAttribute('viewBox')!.split(' ');
  if (viewBoxParts.length !== 4) return svg;

  svgElement.setAttribute('width', viewBoxParts[2]!);
  svgElement.setAttribute('height', viewBoxParts[3]!);
  return new XMLSerializer().serializeToString(svgDoc);
};

export const prepareMermaidSvgString = (svg: string): string =>
  applyFirefoxSizeFix(ensureXmlSafeVoidElements(svg));
