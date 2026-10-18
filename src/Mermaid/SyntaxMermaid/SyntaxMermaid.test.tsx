import { act, render } from '@testing-library/react';

import SyntaxMermaid from './index';

const SOURCE = `flowchart TD
  A[User message] --> B{Has tool call?}
  B -->|Yes| C[Run tool]
  C --> D[(Vector DB)]
  B -->|No| E[Compose answer]
  D --> E`;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const settle = () => act(() => vi.runAllTimers());

describe('SyntaxMermaid streaming', () => {
  it('never surfaces a syntax error while chunks arrive', () => {
    const { container, rerender } = render(<SyntaxMermaid animated>{''}</SyntaxMermaid>);

    for (let end = 4; end <= SOURCE.length; end += 7) {
      rerender(<SyntaxMermaid animated>{SOURCE.slice(0, end)}</SyntaxMermaid>);
      settle();
      expect(container.querySelector('pre')).toBeNull();
    }

    rerender(<SyntaxMermaid animated>{SOURCE}</SyntaxMermaid>);
    settle();
    expect(container.querySelector('svg.pele-flowchart')).not.toBeNull();
  });

  it('reports the error once streaming has finished', () => {
    const broken = 'flowchart TD\n  A[Start] --> B{Is i';
    const { container, rerender } = render(<SyntaxMermaid animated>{broken}</SyntaxMermaid>);
    settle();
    expect(container.querySelector('pre')).toBeNull();

    rerender(<SyntaxMermaid animated={false}>{broken}</SyntaxMermaid>);

    expect(container.querySelector('pre')?.textContent).toBe(broken);
  });
});
