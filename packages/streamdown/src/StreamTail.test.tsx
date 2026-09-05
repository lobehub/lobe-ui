import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createStreamTailNode, StreamTail } from './StreamTail';

const delayOf = (el: Element) => Number.parseFloat((el as HTMLElement).style.animationDelay);

describe('StreamTail', () => {
  it('freezes each delay per mounted instance and resumes from real elapsed time on remount', () => {
    const now = performance.now();
    const node = createStreamTailNode({
      items: [{ birth: now - 50, key: 3, value: 'x' }],
      text: 'ab',
    });

    const { container, rerender, unmount } = render(<StreamTail node={node} />);
    const first = delayOf(container.querySelector('.stream-char')!);
    expect(first).toBeLessThanOrEqual(-50);
    expect(first).toBeGreaterThan(-180);

    rerender(
      <StreamTail
        node={createStreamTailNode({
          items: [{ birth: now - 50, key: 3, value: 'x' }],
          text: 'ab',
        })}
      />,
    );
    expect(delayOf(container.querySelector('.stream-char')!)).toBe(first);
    unmount();

    const remounted = render(<StreamTail node={node} />);
    const later = delayOf(remounted.container.querySelector('.stream-char')!);
    expect(later).toBeLessThanOrEqual(first);
    expect(remounted.container.textContent).toBe('abx');
  });

  it('renders skipped chars as revealed spans without a delay', () => {
    const node = createStreamTailNode({ items: [{ birth: null, key: 0, value: 'x' }], text: '' });
    const { container } = render(<StreamTail node={node} />);
    const span = container.querySelector('.stream-char-revealed') as HTMLElement;
    expect(span.style.animationDelay).toBe('');
  });
});
