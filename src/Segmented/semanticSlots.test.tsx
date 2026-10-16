import { render } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { ConfigProvider, DateRangePicker, Segmented } from '@/index';

const wrap = (ui: ReactNode) => render(<ConfigProvider motion={motion}>{ui}</ConfigProvider>);

if (!globalThis.ResizeObserver)
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;

describe('semantic slots', () => {
  it('Segmented applies every classNames / styles slot', () => {
    const { container } = wrap(
      <Segmented
        classNames={{
          indicator: 'c-indicator',
          item: 'c-item',
          itemIcon: 'c-icon',
          itemLabel: 'c-label',
          list: 'c-list',
          root: 'c-root',
        }}
        options={[
          { icon: <i />, label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
        styles={{
          item: { height: 28 },
          itemLabel: { fontSize: 12 },
          list: { gap: 3 },
          root: { width: 300 },
        }}
      />,
    );
    const root = container.querySelector('[role="group"]') as HTMLElement;
    expect(root.classList.contains('c-root')).toBe(true);
    expect(root.classList.contains('c-list')).toBe(true);
    expect(root.style.width).toBe('300px');
    expect(root.style.gap).toBe('3px');
    expect(container.querySelector('.c-indicator')).not.toBeNull();
    const items = container.querySelectorAll<HTMLElement>('[data-segmented-item]');
    expect(items).toHaveLength(2);
    for (const item of items) {
      expect(item.classList.contains('c-item')).toBe(true);
      expect(item.style.height).toBe('28px');
    }
    expect(container.querySelector('.c-icon')).not.toBeNull();
    expect((container.querySelector('.c-label') as HTMLElement).style.fontSize).toBe('12px');
  });

  it('DateRangePicker takes root / input / suffix slots and can be full width', () => {
    const { container } = wrap(
      <DateRangePicker
        classNames={{ input: 'r-input', root: 'r-root', suffix: 'r-suffix' }}
        styles={{ input: { textAlign: 'center' }, root: { width: '100%' } }}
      />,
    );
    const root = container.querySelector('.lobe-picker-range') as HTMLElement;
    expect(root.classList.contains('r-root')).toBe(true);
    expect(root.style.width).toBe('100%');
    const inputs = container.querySelectorAll<HTMLInputElement>('input.r-input');
    expect(inputs).toHaveLength(2);
    for (const input of inputs) expect(input.style.textAlign).toBe('center');
    expect(container.querySelector('.r-suffix')).not.toBeNull();
  });
});
