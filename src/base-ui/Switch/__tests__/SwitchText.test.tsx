import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Switch from '../Switch';

describe('Switch inner text', () => {
  afterEach(() => vi.restoreAllMocks());

  it.each(['default', 'small'] as const)(
    'grows to fit checkedChildren / unCheckedChildren (%s)',
    (size) => {
      render(<Switch checkedChildren="Enabled" size={size} unCheckedChildren="Off" />);
      const root = screen.getByRole('switch');
      const sizer = root.querySelector('[aria-hidden]') as HTMLElement;
      // an in-flow sizer holds both labels so the root width fits the longer one
      expect(sizer).not.toBeNull();
      expect(sizer.textContent).toBe('EnabledOff');
      expect(getComputedStyle(root).width).not.toBe(size === 'small' ? '28px' : '36px');
    },
  );

  it('moves the thumb across the measured (wider) track', async () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.getAttribute('role') === 'switch' ? 80 : 0;
    });
    render(<Switch defaultChecked checkedChildren="Enabled" unCheckedChildren="Off" />);
    const thumb = screen.getByRole('switch').querySelector(':scope > span:last-child');
    // 80 - 2 * 2px padding - 18px thumb
    await waitFor(() =>
      expect((thumb as HTMLElement).style.getPropertyValue('--switch-x')).toBe('58px'),
    );
  });

  it('keeps the fixed size without inner text', () => {
    render(<Switch defaultChecked />);
    const root = screen.getByRole('switch');
    expect(root.querySelector('[aria-hidden]')).toBeNull();
    expect(root.querySelector('span')!.style.getPropertyValue('--switch-x')).toBe('14px');
  });
});
