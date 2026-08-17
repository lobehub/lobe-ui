/**
 * @vitest-environment jsdom
 */
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ConfigProvider from '@/ConfigProvider';

import Popover from '../Popover';
import PopoverGroup from '../PopoverGroup';

vi.mock('antd-style', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd-style')>();
  return {
    ...actual,
    createStaticStyles: vi.fn((fn: any) => {
      const result = fn({ css: () => '', cssVar: {} });
      return new Proxy(result, {
        get: (target, key) => target[key as keyof typeof target] || '',
      });
    }),
  };
});

const renderWithProvider = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

describe('PopoverGroup click triggers', () => {
  afterEach(() => {
    cleanup();
  });

  it('opens a click member on the first press', async () => {
    renderWithProvider(
      <PopoverGroup>
        <Popover content={<div>hover-card</div>}>
          <button type="button">hover-row</button>
        </Popover>
        <Popover content={<div>click-menu</div>} trigger="click">
          <button type="button">click-row</button>
        </Popover>
      </PopoverGroup>,
    );

    await act(async () => {
      screen.getByRole('button', { name: 'click-row' }).click();
    });

    await waitFor(() => {
      expect(screen.getByText('click-menu')).toBeTruthy();
    });
  });

  it('opens a click member while a hover member is the active one', async () => {
    const { container } = renderWithProvider(
      <PopoverGroup>
        <Popover content={<div>hover-card</div>} mouseEnterDelay={0}>
          <button type="button">hover-row</button>
        </Popover>
        <Popover content={<div>click-menu</div>} trigger="click">
          <button type="button">click-row</button>
        </Popover>
      </PopoverGroup>,
    );

    const hoverRow = screen.getByRole('button', { name: 'hover-row' });
    await act(async () => {
      hoverRow.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      hoverRow.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    });

    await act(async () => {
      screen.getByRole('button', { name: 'click-row' }).click();
    });

    await waitFor(() => {
      expect(screen.getByText('click-menu')).toBeTruthy();
    });
    expect(container).toBeTruthy();
  });
});
