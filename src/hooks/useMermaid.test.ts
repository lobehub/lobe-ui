import { describe, expect, it } from 'vitest';

import { renderMermaid } from './useMermaid';

describe('renderMermaid', () => {
  it.each([
    ['flowchart LR\n  A --> B', 'flowchart'],
    ['sequenceDiagram\n  A->>B: hi', 'sequence'],
    ['classDiagram\n  Animal <|-- Duck', 'class'],
    ['stateDiagram-v2\n  [*] --> Still', 'state'],
    ['erDiagram\n  CUSTOMER ||--o{ ORDER : places', 'er'],
    ['pie title Pets\n  "Dogs": 3', 'pie'],
    ['gantt\n  dateFormat YYYY-MM-DD\n  section A\n  Task :a1, 2024-01-01, 3d', 'gantt'],
    ['mindmap\n  root((x))\n    a', 'mindmap'],
    ['timeline\n  2020 : a', 'timeline'],
    ['journey\n  title A\n  section S\n    Task: 5: Me', 'journey'],
    ['gitGraph\n  commit\n  branch dev\n  commit', 'gitGraph'],
  ])('renders %s locally', (source, type) => {
    const { error, svg } = renderMermaid(source, 'scope-');

    expect(error).toBeUndefined();
    expect(svg).toContain('<svg');
    expect(svg).toContain(`pele-${type}`);
  });

  it('produces strict-XML output for <br> labels', () => {
    const { error, svg } = renderMermaid('flowchart LR\n  A["line1<br>line2"] --> B', 'scope-');

    expect(error).toBeUndefined();
    expect(svg).not.toContain('foreignObject');
    expect(new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('parsererror')).toBe(
      null,
    );
  });

  it('colors through theme variables only', () => {
    const { svg } = renderMermaid('pie\n  "a": 1\n  "b": 2', 'scope-');

    expect(svg).toContain('var(--pele-bg');
    expect(svg).not.toMatch(/fill="#[\da-f]+"/i);
  });

  it('strips script vectors from labels and links', () => {
    const { svg } = renderMermaid(
      'flowchart LR\n  A["<img src=x onerror=alert(1)>"] --> B\n  click A "javascript:alert(1)"',
      'scope-',
    );

    expect(svg).not.toContain('onerror');
    expect(svg).not.toContain('javascript:');
  });

  it('reports a syntax error instead of throwing', () => {
    const { error, svg } = renderMermaid('flowchart TD\n  A[Start] --> B{Is i', 'scope-');

    expect(error).toBeTruthy();
    expect(svg).toBe('');
  });

  it('returns empty output for empty content', () => {
    expect(renderMermaid('', 'scope-')).toEqual({ svg: '' });
  });
});
