import { cleanup, screen } from '@testing-library/react';
import dayjs from 'dayjs';

import DatePicker from '../DatePicker';
import DateRangePicker from '../DateRangePicker';
import type { DatePickerProps, DateRangePickerProps } from '../type';
import { render } from './render';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const root = (container: HTMLElement) => container.querySelector<HTMLElement>('.lobe-picker')!;
const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown')!;
const q = (selector: string) => popup().querySelector<HTMLElement>(selector)!;

const fullClassNames = {
  input: 'my-input',
  popup: {
    body: 'my-body',
    container: 'my-container',
    content: 'my-content',
    footer: 'my-footer',
    header: 'my-header',
    item: 'my-item',
    root: 'my-popup',
  },
  prefix: 'my-prefix',
  root: 'my-root',
  suffix: 'my-suffix',
};

describe('DatePicker Semantic DOM', () => {
  afterEach(cleanup);

  test('classNames reach every root and popup part', () => {
    const { container } = render(
      <DatePicker open showNow classNames={fullClassNames} prefix={<span>P</span>} />,
    );
    expect(root(container).classList.contains('my-root')).toBe(true);
    expect(container.querySelector('.lobe-picker-prefix')!.classList.contains('my-prefix')).toBe(
      true,
    );
    expect(screen.getByRole('textbox').classList.contains('my-input')).toBe(true);
    expect(container.querySelector('.lobe-picker-suffix')!.classList.contains('my-suffix')).toBe(
      true,
    );

    expect(popup().classList.contains('my-popup')).toBe(true);
    expect(q('.lobe-picker-date-panel-container').classList.contains('my-container')).toBe(true);
    expect(q('.lobe-picker-header').classList.contains('my-header')).toBe(true);
    expect(q('.lobe-picker-body').classList.contains('my-body')).toBe(true);
    expect(q('.lobe-picker-content').classList.contains('my-content')).toBe(true);
    expect(q('.lobe-picker-cell').classList.contains('my-item')).toBe(true);
    expect(q('.lobe-picker-footer').classList.contains('my-footer')).toBe(true);
  });

  test('styles reach every root and popup part, keeping the popup z-index', () => {
    const { container } = render(
      <DatePicker
        open
        showNow
        prefix={<span>P</span>}
        styles={{
          input: { color: 'rgb(1, 2, 3)' },
          popup: {
            body: { paddingTop: 1 },
            container: { paddingTop: 2 },
            content: { paddingTop: 3 },
            footer: { paddingTop: 4 },
            header: { paddingTop: 5 },
            item: { paddingTop: 6 },
            root: { paddingTop: 7 },
          },
          prefix: { paddingTop: 8 },
          root: { paddingTop: 9 },
          suffix: { paddingTop: 10 },
        }}
      />,
    );
    expect(root(container).style.paddingTop).toBe('9px');
    expect(container.querySelector<HTMLElement>('.lobe-picker-prefix')!.style.paddingTop).toBe(
      '8px',
    );
    expect(screen.getByRole('textbox').style.color).toBe('rgb(1, 2, 3)');
    expect(container.querySelector<HTMLElement>('.lobe-picker-suffix')!.style.paddingTop).toBe(
      '10px',
    );

    expect(popup().style.paddingTop).toBe('7px');
    expect((popup().parentElement as HTMLElement).style.zIndex).not.toBe('');
    expect(q('.lobe-picker-date-panel-container').style.paddingTop).toBe('2px');
    expect(q('.lobe-picker-header').style.paddingTop).toBe('5px');
    expect(q('.lobe-picker-body').style.paddingTop).toBe('1px');
    expect(q('.lobe-picker-content').style.paddingTop).toBe('3px');
    expect(q('.lobe-picker-cell').style.paddingTop).toBe('6px');
    expect(q('.lobe-picker-footer').style.paddingTop).toBe('4px');
  });

  test('function forms receive { props } with the merged size', () => {
    const classNames = vi.fn(({ props }: { props: DatePickerProps }) => ({
      popup: { root: `popup-${props.size}` },
      root: `root-${props.size}-${props.picker}`,
    }));
    const styles = vi.fn(({ props }: { props: DatePickerProps }) => ({
      root: { width: props.disabled ? 100 : 200 },
    }));
    const { container } = render(
      <DatePicker open classNames={classNames} picker="month" styles={styles} />,
    );
    expect(classNames.mock.calls[0][0].props.size).toBe('medium');
    expect(root(container).classList.contains('root-medium-month')).toBe(true);
    expect(popup().classList.contains('popup-medium')).toBe(true);
    expect(root(container).style.width).toBe('200px');
  });

  test('a classNames.popup string is the popup root class', () => {
    render(<DatePicker open classNames={{ popup: 'string-popup' }} />);
    expect(popup().classList.contains('string-popup')).toBe(true);
    // The theme scope class is still merged in, and the other parts keep working.
    expect(q('.lobe-picker-header')).toBeTruthy();
  });

  test('rootClassName goes on the root and on the popup', () => {
    const { container } = render(<DatePicker open rootClassName="my-root-class" />);
    expect(root(container).classList.contains('my-root-class')).toBe(true);
    expect(popup().classList.contains('my-root-class')).toBe(true);
  });

  test('deprecated popupClassName / dropdownClassName / popupStyle map to popup.root', () => {
    const { unmount } = render(
      <DatePicker
        open
        classNames={{ popup: { root: 'semantic-popup' } }}
        popupClassName="legacy-popup"
        popupStyle={{ paddingTop: 11 }}
        styles={{ popup: { root: { paddingBottom: 12 } } }}
      />,
    );
    expect(popup().classList.contains('semantic-popup')).toBe(true);
    expect(popup().classList.contains('legacy-popup')).toBe(true);
    expect(popup().style.paddingTop).toBe('11px');
    expect(popup().style.paddingBottom).toBe('12px');
    unmount();

    render(<DatePicker open dropdownClassName="legacy-dropdown" />);
    expect(popup().classList.contains('legacy-dropdown')).toBe(true);
  });

  test('popupClassName wins over dropdownClassName, as in antd', () => {
    render(<DatePicker open dropdownClassName="old" popupClassName="new" />);
    expect(popup().classList.contains('new')).toBe(true);
    expect(popup().classList.contains('old')).toBe(false);
  });
});

describe('DateRangePicker Semantic DOM', () => {
  afterEach(cleanup);

  test('classNames / styles reach both inputs and the popup parts', () => {
    const { container } = render(
      <DateRangePicker
        open
        classNames={fullClassNames}
        defaultValue={[dayjs('2026-10-01'), dayjs('2026-10-10')]}
        prefix={<span>P</span>}
        styles={{ input: { color: 'rgb(4, 5, 6)' }, popup: { root: { paddingTop: 3 } } }}
      />,
    );
    expect(root(container).classList.contains('my-root')).toBe(true);
    expect(container.querySelector('.lobe-picker-prefix')!.classList.contains('my-prefix')).toBe(
      true,
    );
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
    for (const input of inputs) {
      expect(input.classList.contains('my-input')).toBe(true);
      expect(input.style.color).toBe('rgb(4, 5, 6)');
    }
    expect(popup().classList.contains('my-popup')).toBe(true);
    expect(popup().style.paddingTop).toBe('3px');
    expect(popup().querySelectorAll('.my-header')).toHaveLength(2);
    expect(popup().querySelectorAll('.my-body')).toHaveLength(2);
    expect(q('.lobe-picker-cell').classList.contains('my-item')).toBe(true);
  });

  test('function form receives the range props; popup string and deprecated aliases work', () => {
    const classNames = vi.fn(({ props }: { props: DateRangePickerProps }) => ({
      popup: `range-${props.picker}`,
    }));
    render(
      <DateRangePicker
        open
        classNames={classNames}
        picker="year"
        popupClassName="legacy"
        popupStyle={{ paddingTop: 5 }}
      />,
    );
    expect(popup().classList.contains('range-year')).toBe(true);
    expect(popup().classList.contains('legacy')).toBe(true);
    expect(popup().style.paddingTop).toBe('5px');
  });
});
