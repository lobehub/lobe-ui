import { describe, expect, it } from 'vitest';

import { postProcessMermaidSvg } from './postProcessMermaidSvg';

const tokens = {
  borderRadius: 8,
  labelBackground: '#181c22',
  labelBorder: '#343b4a',
  labelPillRadius: 999,
  labelText: '#f5f7fa',
  noteBackground: '#112233',
  noteBorder: '#445566',
  noteText: '#ddeeff',
};

describe('postProcessMermaidSvg', () => {
  it('should override mermaid theme background in style element', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <style>#mermaid-r-25-m .edgeLabel { background-color: hsl(0, 0%, 34%); text-align: center; }</style>
        <g class="edgeLabel">
          <g class="label" transform="translate(-30, -12)">
            <foreignObject width="60" height="24">
              <div xmlns="http://www.w3.org/1999/xhtml" class="labelBkg" style="background-color: #000">
                <span class="edgeLabel">Link text</span>
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).toContain(
      '.edgeLabel, .edgeLabel p { background-color: transparent !important; }',
    );
    expect(result).toContain(
      '.labelBkg { background-color: transparent !important; box-shadow: none !important; }',
    );
  });

  it('should insert SVG pill rect behind edge label foreignObject', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <g class="edgeLabel">
          <g class="label" transform="translate(-30, -12)">
            <foreignObject width="60" height="24">
              <div xmlns="http://www.w3.org/1999/xhtml" class="labelBkg" style="background-color: #000">
                <span class="edgeLabel">Link text</span>
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).toContain('class="edge-label-pill"');
    expect(result).toContain('rx="12"');
    expect(result).toContain('ry="12"');
    expect(result).toContain('fill="#181c22"');
    expect(result).toContain('stroke="#343b4a"');
    expect(result).toContain('width="72"');
    expect(result).toContain('x="-6"');
    expect(result).toContain('background-color: transparent');
    expect(result).toContain('box-shadow: none');
  });

  it('should clear edgeLabel background and set text color', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <foreignObject width="120" height="32">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <span class="edgeLabel" style="background-color: red">Link text</span>
          </div>
        </foreignObject>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).toContain('background-color: transparent');
    expect(result).toContain('color: #f5f7fa');
  });

  it('should reuse existing rect as pill instead of inserting a new one', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <g class="edgeLabel">
          <g class="label" transform="translate(-30, -12)">
            <rect class="labelBox" width="60" height="24" rx="0" ry="0" />
            <foreignObject width="60" height="24">
              <div xmlns="http://www.w3.org/1999/xhtml" class="labelBkg" style="background-color: #000">
                <span class="edgeLabel">From Duck</span>
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).not.toContain('class="edge-label-pill"');
    expect(result).toContain('rx="999"');
    expect(result).toContain('fill="#181c22"');
  });

  it('should skip pill rect for empty edge labels', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <g class="edgeLabel">
          <g class="label" transform="translate(0, 0)">
            <foreignObject width="0" height="0">
              <div xmlns="http://www.w3.org/1999/xhtml" class="labelBkg">
                <span class="edgeLabel"></span>
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).not.toContain('class="edge-label-pill"');
  });

  it('should round svg label and note boxes and apply theme colors', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <g class="edgeLabel"><rect width="10" height="10" /></g>
        <rect class="labelBox" width="10" height="10" />
        <rect class="note" width="10" height="10" />
        <text class="noteText">Rational thoughts!</text>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).toContain(
      'class="labelBox" width="10" height="10" rx="999" ry="999" fill="#181c22" stroke="#343b4a"',
    );
    expect(result).toContain(
      'class="note" width="10" height="10" rx="8" ry="8" fill="#112233" stroke="#445566"',
    );
    expect(result).toContain('class="noteText" fill="#ddeeff"');
  });

  it('should round common mermaid rect nodes including nested class groups', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <g class="classGroup"><g><rect width="10" height="10" /></g></g>
        <g class="node"><rect width="12" height="12" /></g>
        <rect class="actor" width="14" height="14" />
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).toContain(
      '<g class="classGroup"><g><rect width="10" height="10" rx="8" ry="8"/></g></g>',
    );
    expect(result).toContain('<g class="node"><rect width="12" height="12" rx="8" ry="8"/></g>');
    expect(result).toContain('class="actor" width="14" height="14" rx="8" ry="8"');
  });

  it('should round rectangle-like path boxes used by classBox and note shapes', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <g class="basic label-container">
          <path d="M 0 0 L 40 0 L 40 20 L 0 20 Z" />
        </g>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).toContain('A 8 8 0 0 1 40 8');
    expect(result).toContain('A 8 8 0 0 1 32 20');
  });

  it('should merge rough border path into rounded fill path in label containers', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <g class="basic label-container">
          <path d="M 0 0 L 80 0 L 80 40 L 0 40 Z" stroke="none" stroke-width="0" fill="#0d0d0d" />
          <path d="M0 0 C20 0, 60 0, 80 0 M80 0 C80 10, 80 30, 80 40 M80 40 C60 40, 20 40, 0 40 M0 40 C0 30, 0 10, 0 0" stroke="#ccc" stroke-width="1.3" fill="none" />
        </g>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).toContain('A 8 8 0 0 1');
    expect(result).toContain('stroke="#ccc"');
    expect(result).toContain('stroke-width="1.3"');
    expect(result).not.toContain('fill="none"');
  });

  it('should convert polygon to rounded path for diamond shapes', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <g class="node">
          <polygon points="50,0 100,-50 50,-100 0,-50" class="label-container" transform="translate(-50, 50)" />
        </g>
      </svg>
    `;

    const result = postProcessMermaidSvg(svg, tokens);

    expect(result).not.toContain('<polygon');
    expect(result).toContain('<path');
    expect(result).toContain('Q 50 0');
    expect(result).toContain('Q 100 -50');
    expect(result).toContain('Q 50 -100');
    expect(result).toContain('Q 0 -50');
    expect(result).toContain('class="label-container"');
    expect(result).toContain('transform="translate(-50, 50)"');
  });
});
