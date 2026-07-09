/**
 * @vitest-environment jsdom
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ConfigProvider from '@/ConfigProvider';

import Popover from '../Popover';

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

describe('Popover hover-only trigger', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not pin open after click following hover open', async () => {
    renderWithProvider(
      <Popover
        content={<div>hover-card</div>}
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        trigger="hover"
      >
        <button type="button">trigger</button>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'trigger' });

    await act(async () => {
      fireEvent.mouseEnter(trigger);
    });

    await waitFor(() => {
      expect(screen.getByText('hover-card')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.click(trigger);
    });

    expect(screen.getByText('hover-card')).toBeTruthy();

    await act(async () => {
      fireEvent.mouseLeave(trigger);
    });

    await waitFor(() => {
      expect(screen.queryByText('hover-card')).toBeNull();
    });
  });

  it('does not open on click when trigger is hover-only', async () => {
    renderWithProvider(
      <Popover content={<div>hover-card</div>} mouseEnterDelay={0} trigger="hover">
        <button type="button">trigger</button>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'trigger' });

    await act(async () => {
      fireEvent.click(trigger);
    });

    expect(screen.queryByText('hover-card')).toBeNull();
  });

  it('still opens on click when trigger is click', async () => {
    renderWithProvider(
      <Popover content={<div>click-card</div>} trigger="click">
        <button type="button">trigger</button>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'trigger' });

    await act(async () => {
      fireEvent.pointerDown(trigger, { button: 0, pointerType: 'mouse' });
      fireEvent.click(trigger);
    });

    await waitFor(() => {
      expect(screen.getByText('click-card')).toBeTruthy();
    });
  });
});
