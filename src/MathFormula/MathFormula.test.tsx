import { render } from '@testing-library/react';

import MathFormula from './MathFormula';

describe('MathFormula', () => {
  test('typesets inline math in a span', () => {
    const { container } = render(<MathFormula value="E = mc^2" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SPAN');
    expect(root.dataset.display).toBe('inline');
    expect(root.querySelector('.katex')).not.toBeNull();
    expect(root.querySelector('.katex-display')).toBeNull();
  });

  test('typesets a block in display mode', () => {
    const { container } = render(<MathFormula block value={String.raw`\frac{1}{n}`} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root.querySelector('.katex-display')).not.toBeNull();
  });

  test('shows invalid TeX as an error instead of throwing', () => {
    const { container } = render(<MathFormula value={String.raw`\frac{1}{`} />);
    expect(container.querySelector('.katex-error')).not.toBeNull();
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const value = String.raw`\sum_{i=1}^{n} x_i`;
    const { container, rerender } = render(<MathFormula block value={value} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const defaultClass = root.className;
    rerender(<MathFormula block value={value} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.className).not.toBe(defaultClass);
    expect(root.querySelector<HTMLElement>('.katex-display')!.style.margin).toBe('0px');
  });
});
