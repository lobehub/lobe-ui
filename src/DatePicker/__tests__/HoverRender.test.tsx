import { cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { MotionProvider } from '@/MotionProvider';

import DatePicker from '../DatePicker';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);
const render = (ui: ReactNode) => rtlRender(ui, { wrapper: Wrapper });

const input = () => screen.getAllByRole('textbox')[0] as HTMLInputElement;
const cell = (text: string) =>
  [...document.querySelectorAll<HTMLElement>('.lobe-picker-cell-in-view')].find(
    (node) => node.querySelector('.lobe-picker-cell-inner')?.textContent === text,
  )!;

describe('DatePicker hover rendering', () => {
  afterEach(cleanup);

  test('hovering cells previews in the input without re-rendering the panel', () => {
    const cellRender = vi.fn((_date, info) => info.originNode);
    render(<DatePicker open cellRender={cellRender} defaultValue={dayjs('2027-01-19')} />);
    const before = cellRender.mock.calls.length;

    fireEvent.mouseEnter(cell('20'));
    expect(input().value).toBe('2027-01-20');
    fireEvent.mouseLeave(cell('20'));
    fireEvent.mouseEnter(cell('21'));
    expect(input().value).toBe('2027-01-21');
    fireEvent.mouseLeave(cell('21'));
    expect(input().value).toBe('2027-01-19');

    expect(cellRender.mock.calls.length).toBe(before);
  });
});
