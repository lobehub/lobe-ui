import { cleanup, render } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { MotionProvider } from '@/MotionProvider';

import Button from '../Button';

const renderButton = (ui: ReactNode) =>
  render(<MotionProvider motion={motion}>{ui}</MotionProvider>);

describe('Button stable classes', () => {
  afterEach(cleanup);

  it('keeps the block class when rendered as a link', () => {
    const { container } = renderButton(
      <Button className="user-x" href="#">
        Link
      </Button>,
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.tagName).toBe('A');
    expect(root.classList.contains('lobe-button')).toBe(true);
    expect(root.classList.contains('user-x')).toBe(true);
  });

  it('exposes its own props as data attributes', () => {
    const { container } = renderButton(
      <Button danger loading size="small" type="primary">
        Save
      </Button>,
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.dataset.type).toBe('primary');
    expect(root.dataset.size).toBe('small');
    expect(root.dataset.danger).toBe('');
    expect(root.dataset.loading).toBe('');
    expect(root.dataset.ghost).toBeUndefined();
  });

  it('lets data attributes passed by the caller win', () => {
    const { container } = renderButton(
      <Button loading data-loading="custom">
        Save
      </Button>,
    );
    expect((container.firstElementChild as HTMLElement).dataset.loading).toBe('custom');
  });
});
