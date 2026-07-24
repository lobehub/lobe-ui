import { describe, expect, it } from 'vitest';

import { prepareMermaidSvgString } from './prepareMermaidSvg';

const parsesAsStrictXml = (svg: string): boolean => {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  return !doc.querySelector('parsererror');
};

const svgWithUnclosedBr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><foreignObject width="200" height="100"><div xmlns="http://www.w3.org/1999/xhtml"><p>G-CSF 启动<br>化疗前24h</p></div></foreignObject></svg>`;

describe('prepareMermaidSvgString', () => {
  it('reproduces the bug: raw mermaid <br> output fails strict XML parsing', () => {
    expect(parsesAsStrictXml(svgWithUnclosedBr)).toBe(false);
  });

  it('makes unclosed <br> loadable as a standalone image/svg+xml document', () => {
    const result = prepareMermaidSvgString(svgWithUnclosedBr);

    expect(result).not.toContain('<br>');
    expect(result).toContain('<br/>');
    expect(parsesAsStrictXml(result)).toBe(true);
  });

  it('normalizes other HTML void elements while leaving SVG elements untouched', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml"><span>a<br>b</span><hr><img src="x.png"></div></foreignObject><image href="y.png"/><rect width="10" height="10"/></svg>`;

    const result = prepareMermaidSvgString(svg);

    expect(result).toContain('<hr/>');
    expect(result).toContain('<img src="x.png"/>');
    expect(result).toContain('<image href="y.png"/>');
    expect(result).toContain('<rect width="10" height="10"/>');
    expect(parsesAsStrictXml(result)).toBe(true);
  });

  it('preserves already self-closed void elements and case-sensitive attributes', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml"><p>a<br/>b</p></div></foreignObject></svg>`;

    const result = prepareMermaidSvgString(svg);

    expect(result).toContain('viewBox="0 0 50 50"');
    expect(result).toContain('<br/>');
    expect(result).not.toContain('<br/><br/>');
    expect(parsesAsStrictXml(result)).toBe(true);
  });

  it('leaves diagrams without HTML labels byte-for-byte unchanged', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><g class="node"><rect width="10" height="10"/></g></svg>`;

    expect(prepareMermaidSvgString(svg)).toBe(svg);
  });
});
