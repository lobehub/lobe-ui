import { cleanup, render } from '@testing-library/react';

import LoadingDots from './LoadingDots';

describe('LoadingDots', () => {
  afterEach(cleanup);

  test('leaves the gap to the stylesheet default unless one is given', () => {
    const { container } = render(<LoadingDots />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--loading-dots-gap')).toBe('');
    expect(root.querySelectorAll('.lobe-chat-loading-dots__dot')).toHaveLength(3);
  });

  test('gap, size and color land on CSS variables', () => {
    const { container } = render(<LoadingDots color="red" gap={2} size={4} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--loading-dots-gap')).toBe('2px');
    expect(root.style.getPropertyValue('--loading-dots-size')).toBe('4px');
    expect(root.style.getPropertyValue('--loading-dots-color')).toBe('red');
  });
});
