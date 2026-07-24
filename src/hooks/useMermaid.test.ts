import { THEMES } from 'beautiful-mermaid';
import { describe, expect, it } from 'vitest';

import { createMermaidOptions, renderMermaid } from './useMermaid';

describe('renderMermaid', () => {
  it.each([
    ['flowchart LR\n  A --> B', 'flowchart'],
    ['sequenceDiagram\n  A->>B: hi', 'sequence'],
    ['classDiagram\n  Animal <|-- Duck', 'class'],
    ['stateDiagram-v2\n  [*] --> Still', 'state'],
    ['erDiagram\n  CUSTOMER ||--o{ ORDER : places', 'er'],
  ])('renders %s natively', (source) => {
    const { error, svg } = renderMermaid(source, 'scope');

    expect(error).toBeUndefined();
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox');
  });

  it('renders HTML <br> labels without foreignObject (no XML-strictness failure)', () => {
    const { error, svg } = renderMermaid('flowchart LR\n  A["line1<br>line2"] --> B', 'scope');

    expect(error).toBeUndefined();
    expect(svg).not.toContain('foreignObject');
    expect(new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('parsererror')).toBe(
      null,
    );
  });

  it.each([
    'pie title Pets\n  "Dogs": 3',
    'gantt\n  title A',
    'mindmap\n  root((x))',
    'timeline\n  title A',
    'journey\n  title A',
  ])('defers unsupported diagram types to the CDN fallback', (source) => {
    const { error, svg } = renderMermaid(source, 'scope');

    expect(error).toBe('unsupported');
    expect(svg).toBe('');
  });

  it('returns empty output for empty content', () => {
    expect(renderMermaid('', 'scope')).toEqual({ svg: '' });
  });
});

describe('createMermaidOptions', () => {
  it('points the default theme at antd CSS variables so no token is read in JS', () => {
    const result = createMermaidOptions('lobe-theme');

    expect(result).toMatchObject({
      accent: 'var(--ant-color-primary)',
      bg: 'var(--ant-color-bg-container)',
      fg: 'var(--ant-color-text)',
      transparent: true,
    });
  });

  it('returns a stable reference for the default theme', () => {
    expect(createMermaidOptions('lobe-theme')).toBe(createMermaidOptions());
  });

  it('uses the named beautiful-mermaid palette for a known theme', () => {
    const result = createMermaidOptions('dracula');

    expect(result.bg).toBe(THEMES.dracula.bg);
    expect(result.fg).toBe(THEMES.dracula.fg);
  });
});
