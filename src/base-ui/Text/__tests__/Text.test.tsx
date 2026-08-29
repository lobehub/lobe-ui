import { cleanup, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Text from '../Text';
import type { TextProps } from '../type';

const overflowState = { value: false };

vi.mock('@/hooks/useTextOverflow', () => ({
  useTextOverflow: () => overflowState.value,
}));

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
});

afterEach(() => {
  overflowState.value = false;
  cleanup();
});

const renderText = (children: ReactNode, props: TextProps = {}) =>
  render(
    <ConfigProvider motion={motion}>
      <Text {...props}>{children}</Text>
    </ConfigProvider>,
  );

describe('Text', () => {
  test('renders a div by default and heading semantics with as', () => {
    const { container, rerender } = renderText('Hello');

    expect(container.querySelector('div')).not.toBeNull();
    expect(screen.getByText('Hello').tagName).toBe('DIV');

    rerender(
      <ConfigProvider motion={motion}>
        <Text as="h1">Hello</Text>
      </ConfigProvider>,
    );

    expect(screen.getByRole('heading', { level: 1 })).not.toBeNull();
  });

  test('applies distinct classes per semantic type', () => {
    const plain = renderText('Plain');
    const danger = renderText('Danger', { type: 'danger' });
    const success = renderText('Success', { type: 'success' });

    const plainClass = screen.getByText('Plain').className;
    const dangerClass = screen.getByText('Danger').className;
    const successClass = screen.getByText('Success').className;

    expect(plainClass).not.toBe(dangerClass);
    expect(dangerClass).not.toBe(successClass);
    expect(successClass).not.toBe(plainClass);

    plain.unmount();
    danger.unmount();
    success.unmount();
  });

  test('single-line ellipsis applies nowrap and hidden overflow styles', () => {
    renderText('Long content', { ellipsis: true });

    const el = screen.getByText('Long content');
    const computed = getComputedStyle(el);

    expect(computed.whiteSpace).toBe('nowrap');
    expect(computed.textOverflow).toBe('ellipsis');
  });

  test('multi-line ellipsis clamps rows via -webkit-box', () => {
    renderText('Long content', { ellipsis: { rows: 3 } });

    const el = screen.getByText('Long content');

    expect(el.style.getPropertyValue('-webkit-line-clamp')).toBe('3');
    expect(getComputedStyle(el).display).toBe('-webkit-box');
    expect(getComputedStyle(el).whiteSpace).not.toBe('nowrap');
  });

  test('lineClamp clamps without ellipsis prop', () => {
    renderText('Long content', { lineClamp: 2 });

    const el = screen.getByText('Long content');

    expect(el.style.getPropertyValue('-webkit-line-clamp')).toBe('2');
    expect(getComputedStyle(el).display).toBe('-webkit-box');
  });

  test('tooltipWhenOverflow keeps content unwrapped when not overflowing', () => {
    renderText('Fits entirely', { ellipsis: { tooltipWhenOverflow: true } });

    expect(screen.getByText('Fits entirely').hasAttribute('data-base-ui-tooltip-trigger')).toBe(
      false,
    );
  });

  test('tooltipWhenOverflow wraps content once overflow is detected', () => {
    overflowState.value = true;

    renderText('Overflows the box', { ellipsis: { tooltipWhenOverflow: true } });

    expect(screen.getByText('Overflows the box').hasAttribute('data-base-ui-tooltip-trigger')).toBe(
      true,
    );
  });

  test('object tooltip always wraps regardless of overflow state', () => {
    renderText('Clamped body text', {
      ellipsis: { rows: 2, tooltip: { open: true, title: 'Full text content' } },
    });

    const el = screen.getByText('Clamped body text');

    expect(el.hasAttribute('data-base-ui-tooltip-trigger')).toBe(true);
    expect(el.getAttribute('data-popup-open')).toBe('');
  });

  test('applies classNames and styles slots onto root', () => {
    renderText('Slotted', {
      classNames: { root: 'root-slot' },
      styles: { root: { color: 'rgb(255, 0, 0)' } },
    });

    const el = screen.getByText('Slotted');

    expect(el.classList.contains('root-slot')).toBe(true);
    expect(getComputedStyle(el).color).toBe('rgb(255, 0, 0)');
  });

  test('forwards rest props to the root element', () => {
    renderText('With id', { id: 'text-root' });

    expect(screen.getByText('With id').id).toBe('text-root');
  });

  test('shinyDuration sets the sweep cycle css variable', () => {
    const { container } = renderText('Loading', { shiny: true, shinyDuration: '3s' });
    const el = container.querySelector('div > div') as HTMLElement;

    expect(el.style.getPropertyValue('--shiny-duration')).toBe('3s');
  });
});
