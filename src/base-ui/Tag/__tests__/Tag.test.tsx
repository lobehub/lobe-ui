import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { cssVar } from 'antd-style';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';
import { safeReadableColor } from '@/utils/safeReadableColor';

import Tag from '../Tag';
import type { TagProps } from '../type';
import { colorsPreset, colorsPresetSystem } from '../utils';

const renderTag = (children: ReactNode, props: TagProps = {}) =>
  render(
    <ConfigProvider motion={motion}>
      <Tag {...props}>{children}</Tag>
    </ConfigProvider>,
  );

describe('Tag', () => {
  afterEach(cleanup);

  test('renders children in a span with displayName', () => {
    renderTag('hello');

    expect(screen.getByText('hello').tagName).toBe('SPAN');
    expect(Tag.displayName).toBe('Tag');
  });

  test('applies preset color tokens for the filled variant', () => {
    renderTag('red', { color: 'red' });

    const tag = screen.getByText('red');
    expect(tag.style.background).toBe(colorsPreset('red', 'fillTertiary'));
    expect(tag.style.borderColor).toBe(colorsPreset('red', 'fillQuaternary'));
    expect(tag.style.color).toBe(colorsPreset('red', 'active'));
  });

  test('applies system color tokens', () => {
    renderTag('success', { color: 'success' });

    const tag = screen.getByText('success');
    expect(tag.style.background).toBe(colorsPresetSystem('success', 'fillTertiary'));
    expect(tag.style.color).toBe(colorsPresetSystem('success'));
  });

  test('maps processing to info tokens', () => {
    renderTag('processing', { color: 'processing' });

    const tag = screen.getByText('processing');
    expect(tag.style.background).toBe(colorsPresetSystem('info', 'fillTertiary'));
  });

  test('solid variant uses the solid background and a readable text color', () => {
    renderTag('blue', { color: 'blue', variant: 'solid' });

    const tag = screen.getByText('blue');
    expect(tag.style.background).toBe(colorsPreset('blue'));
    expect(tag.getAttribute('style')).toContain(safeReadableColor(colorsPreset('blue')));
  });

  test('passes raw hex colors through', () => {
    renderTag('hex', { color: '#f59e0b' });

    const tag = screen.getByText('hex');
    expect(tag.style.background).toBe('rgb(245, 158, 11)');
    expect(tag.style.color).toBe(cssVar.colorBgLayout);
  });

  test('borderless variant keeps a transparent background', () => {
    renderTag('cyan', { color: 'cyan', variant: 'borderless' });

    const tag = screen.getByText('cyan');
    expect(tag.style.background).toBe('transparent');
  });

  test('shows pointer cursor only when onClick is provided', () => {
    const { rerender } = render(
      <ConfigProvider motion={motion}>
        <Tag onClick={() => {}}>clickable</Tag>
      </ConfigProvider>,
    );
    expect(getComputedStyle(screen.getByText('clickable')).cursor).toBe('pointer');

    rerender(
      <ConfigProvider motion={motion}>
        <Tag>static</Tag>
      </ConfigProvider>,
    );
    expect(getComputedStyle(screen.getByText('static')).cursor).not.toBe('pointer');
  });

  test.each([
    ['small', '20px'],
    ['middle', '22px'],
    ['large', '28px'],
  ] as const)('applies %s size height', (size, height) => {
    renderTag(size, { size });

    expect(getComputedStyle(screen.getByText(size)).height).toBe(height);
  });

  test('round shape uses a pill radius', () => {
    renderTag('pill', { shape: 'round' });

    expect(getComputedStyle(screen.getByText('pill')).borderRadius).toBe('999px');
  });

  test('closable fires onClose and removes the tag without triggering onClick', () => {
    const handleClose = vi.fn();
    const handleClick = vi.fn();

    renderTag('removable', { closable: true, onClick: handleClick, onClose: handleClose });

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.queryByText('removable')).toBeNull();
  });

  test('supports a custom closeIcon', () => {
    renderTag('custom', { closeIcon: <span>x</span>, closable: true });

    expect(screen.getByRole('button', { name: 'Close' }).textContent).toBe('x');
  });

  test('forwards ref to the root span', () => {
    const spanRef: { current: HTMLSpanElement | null } = { current: null };

    render(
      <ConfigProvider motion={motion}>
        <Tag
          ref={(node) => {
            spanRef.current = node;
          }}
        >
          ref
        </Tag>
      </ConfigProvider>,
    );

    expect(spanRef.current).toBeInstanceOf(HTMLSpanElement);
    expect((spanRef.current as HTMLSpanElement | null)?.textContent).toContain('ref');
  });
});
