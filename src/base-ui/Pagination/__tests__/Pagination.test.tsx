import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import Pagination from '../Pagination';
import { styles } from '../style';

vi.mock('@/base-ui/Select', () => ({
  default: ({ onChange, options, style, value }: any) => (
    <select
      data-testid="size-changer"
      style={style}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

describe('Pagination', () => {
  afterEach(cleanup);

  test('disables prev at the first page and next at the last page', () => {
    render(<Pagination current={1} pageSize={10} total={30} />);

    expect((screen.getByLabelText('Previous page') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText('Next page') as HTMLButtonElement).disabled).toBe(false);

    cleanup();
    render(<Pagination current={3} pageSize={10} total={30} />);

    expect((screen.getByLabelText('Previous page') as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByLabelText('Next page') as HTMLButtonElement).disabled).toBe(true);
  });

  test('marks the current page with aria-current', () => {
    render(<Pagination current={2} pageSize={10} total={50} />);

    const current = screen.getByText('2');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(screen.getByText('1').getAttribute('aria-current')).toBeNull();
  });

  test('is controlled when current is provided', () => {
    const onChange = vi.fn();
    render(<Pagination current={1} pageSize={10} total={50} onChange={onChange} />);

    fireEvent.click(screen.getByText('2'));

    expect(onChange).toHaveBeenCalledWith(2, 10);
    expect(screen.getByText('1').getAttribute('aria-current')).toBe('page');
  });

  test('is uncontrolled by default and advances on click', () => {
    const onChange = vi.fn();
    render(<Pagination defaultCurrent={1} pageSize={10} total={50} onChange={onChange} />);

    fireEvent.click(screen.getByText('2'));

    expect(onChange).toHaveBeenCalledWith(2, 10);
    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page');
  });

  test('clamps and resets current when pageSize shrinks the page count', () => {
    const onChange = vi.fn();
    const Harness = () => {
      const [pageSize, setPageSize] = useState(10);
      return (
        <>
          <Pagination current={9} pageSize={pageSize} total={90} onChange={onChange} />
          <button type="button" onClick={() => setPageSize(50)}>
            shrink
          </button>
        </>
      );
    };
    render(<Harness />);

    expect(screen.getByText('9').getAttribute('aria-current')).toBe('page');

    fireEvent.click(screen.getByText('shrink'));

    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page');
    expect(onChange).toHaveBeenCalledWith(2, 50);
  });

  test('notifies onChange when a controlled current is clamped after total shrinks', () => {
    const onChange = vi.fn();
    const Harness = () => {
      const [total, setTotal] = useState(90);
      return (
        <>
          <Pagination current={9} pageSize={10} total={total} onChange={onChange} />
          <button type="button" onClick={() => setTotal(15)}>
            shrink total
          </button>
        </>
      );
    };
    render(<Harness />);

    expect(screen.getByText('9').getAttribute('aria-current')).toBe('page');

    fireEvent.click(screen.getByText('shrink total'));

    expect(onChange).toHaveBeenCalledWith(2, 10);
    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page');
  });

  test('notifies onChange when an uncontrolled current is clamped after total shrinks', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Pagination defaultCurrent={9} pageSize={10} total={90} onChange={onChange} />,
    );

    expect(screen.getByText('9').getAttribute('aria-current')).toBe('page');

    rerender(<Pagination defaultCurrent={9} pageSize={10} total={15} onChange={onChange} />);

    expect(onChange).toHaveBeenCalledWith(2, 10);
    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page');
  });

  test('calls onPageSizeChange and onChange when the size changer selects an option', () => {
    const onPageSizeChange = vi.fn();
    const onChange = vi.fn();
    render(
      <Pagination
        showSizeChanger
        current={5}
        pageSize={10}
        total={100}
        onChange={onChange}
        onPageSizeChange={onPageSizeChange}
      />,
    );

    fireEvent.change(screen.getByTestId('size-changer'), { target: { value: '20' } });

    expect(onPageSizeChange).toHaveBeenCalledWith(5, 20);
    expect(onChange).toHaveBeenCalledWith(5, 20);
  });

  test('hides when hideOnSinglePage and there is only one page', () => {
    const { container } = render(<Pagination hideOnSinglePage pageSize={10} total={5} />);

    expect(container.firstChild).toBeNull();
  });

  test('disables every button when disabled', () => {
    render(<Pagination disabled current={2} pageSize={10} total={50} />);

    for (const button of screen.getAllByRole('button')) {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    }
  });

  test('keeps the size changer from growing to fill the row', () => {
    render(
      <Pagination
        showSizeChanger
        pageSize={10}
        showTotal={(total) => `${total} items`}
        total={100}
      />,
    );

    const select = screen.getByTestId('size-changer');
    expect(select.style.flex).toBe('0 0 auto');
    expect(select.style.width).toBe('auto');
  });

  test('does not wrap the total text', () => {
    render(<Pagination pageSize={10} showTotal={(total) => `${total} items`} total={100} />);

    expect(getComputedStyle(screen.getByText('100 items')).whiteSpace).toBe('nowrap');
  });

  test('keeps the clamped page after total shrinks and grows back', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Pagination defaultCurrent={9} pageSize={10} total={90} onChange={onChange} />,
    );

    rerender(<Pagination defaultCurrent={9} pageSize={10} total={15} onChange={onChange} />);
    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page');

    onChange.mockClear();
    rerender(<Pagination defaultCurrent={9} pageSize={10} total={90} onChange={onChange} />);

    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders the showTotal range', () => {
    render(
      <Pagination
        current={2}
        pageSize={10}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
        total={95}
      />,
    );

    expect(screen.getByText('11-20 of 95')).toBeTruthy();
  });

  test('renders role and aria-label for navigation', () => {
    render(<Pagination pageSize={10} total={30} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
  });

  test('shows the size changer by default only when total > totalBoundaryShowSizeChanger', () => {
    render(<Pagination total={50} />);
    expect(screen.queryByTestId('size-changer')).toBeNull();
    cleanup();

    render(<Pagination total={51} />);
    expect(screen.getByTestId('size-changer')).toBeTruthy();
    cleanup();

    render(<Pagination total={30} totalBoundaryShowSizeChanger={20} />);
    expect(screen.getByTestId('size-changer')).toBeTruthy();
    cleanup();

    render(<Pagination showSizeChanger={false} total={100} />);
    expect(screen.queryByTestId('size-changer')).toBeNull();
  });

  test('accepts string pageSizeOptions', () => {
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        showSizeChanger
        pageSizeOptions={['5', 15]}
        total={100}
        onPageSizeChange={onPageSizeChange}
      />,
    );

    fireEvent.change(screen.getByTestId('size-changer'), { target: { value: '5' } });

    expect(onPageSizeChange).toHaveBeenCalledWith(1, 5);
  });

  test('quick jumper goes to a clamped page on Enter and ignores invalid input', () => {
    const onChange = vi.fn();
    render(<Pagination showQuickJumper total={50} onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Go to page' }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.keyUp(input, { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
    expect(input.value).toBe('');

    fireEvent.change(input, { target: { value: '9' } });
    fireEvent.keyUp(input, { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith(5, 10);
    expect(screen.getByRole('button', { name: '5' }).getAttribute('aria-current')).toBe('page');
  });

  test('quick jumper with goButton renders a custom button', () => {
    const onChange = vi.fn();
    render(<Pagination showQuickJumper={{ goButton: 'Jump' }} total={50} onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Go to page' });

    fireEvent.change(input, { target: { value: '3' } });
    fireEvent.blur(input);
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Jump' }));
    expect(onChange).toHaveBeenCalledWith(3, 10);
  });

  test('simple mode shows a current-page input and the page count', () => {
    const onChange = vi.fn();
    render(<Pagination simple defaultCurrent={2} total={50} onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Current page' }) as HTMLInputElement;
    expect(input.value).toBe('2');
    expect(screen.getByRole('navigation').textContent).toContain('/5');
    expect(screen.queryByRole('button', { name: '1' })).toBeNull();
    expect(screen.queryByTestId('size-changer')).toBeNull();

    fireEvent.change(input, { target: { value: '4' } });
    fireEvent.keyUp(input, { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith(4, 10);
    expect(input.value).toBe('4');

    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenLastCalledWith(5, 10);
  });

  test('simple readOnly shows the current page as text', () => {
    render(<Pagination current={3} simple={{ readOnly: true }} total={50} />);

    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('navigation').textContent).toContain('3/5');
  });

  test('showLessItems keeps one page on each side of the current page', () => {
    render(<Pagination current={10} total={200} />);
    expect(screen.getByRole('button', { name: '8' })).toBeTruthy();

    cleanup();
    render(<Pagination showLessItems current={10} total={200} />);
    const pages = screen
      .getAllByRole('button')
      .map((button) => button.textContent)
      .filter((text) => /^\d+$/.test(text!));
    expect(pages).toEqual(['1', '9', '10', '11', '20']);
    expect(screen.getByTitle('Previous 3 Pages')).toBeTruthy();
  });

  test('itemRender customises every item type', () => {
    const itemRender = vi.fn((page: number, type: string, element: React.ReactNode) =>
      type === 'page' ? element : `${type}:${page}`,
    );
    render(<Pagination current={10} itemRender={itemRender} total={200} />);

    expect(screen.getByLabelText('Previous page').textContent).toBe('prev:9');
    expect(screen.getByLabelText('Next page').textContent).toBe('next:11');
    expect(screen.getByTitle('Previous 5 Pages').textContent).toBe('jump-prev:5');
    expect(screen.getByTitle('Next 5 Pages').textContent).toBe('jump-next:15');
    expect(screen.getByRole('button', { name: '10' })).toBeTruthy();
    expect(itemRender).toHaveBeenCalledWith(10, 'page', 10);
  });

  test('showTitle adds native titles and can be turned off', () => {
    render(<Pagination total={30} />);
    expect(screen.getByRole('button', { name: '2' }).getAttribute('title')).toBe('2');
    expect(screen.getByLabelText('Next page').getAttribute('title')).toBe('Next Page');

    cleanup();
    render(<Pagination showTitle={false} total={30} />);
    expect(screen.getByRole('button', { name: '2' }).hasAttribute('title')).toBe(false);
    expect(screen.getByLabelText('Next page').hasAttribute('title')).toBe(false);
  });

  test('align lays the pager out as an aligned row', () => {
    render(<Pagination align="end" total={30} />);
    const nav = screen.getByRole('navigation');

    expect(getComputedStyle(nav).display).toBe('flex');
    expect(getComputedStyle(nav).justifyContent).toBe('flex-end');
  });

  test('responsive switches to the small size on extra-small screens', () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      addEventListener: () => {},
      matches: query === '(max-width: 575px)',
      removeEventListener: () => {},
    })) as any;
    try {
      render(<Pagination responsive total={30} />);
      expect(screen.getByLabelText('Next page').classList.contains(styles.small)).toBe(true);

      cleanup();
      render(<Pagination total={30} />);
      expect(screen.getByLabelText('Next page').classList.contains(styles.small)).toBe(false);

      cleanup();
      render(<Pagination responsive size="middle" total={30} />);
      expect(screen.getByLabelText('Next page').classList.contains(styles.small)).toBe(false);
    } finally {
      window.matchMedia = matchMedia;
    }
  });

  test('showSizeChanger accepts Select props and components.sizeChanger replaces the Select', () => {
    const onSizeChange = vi.fn();
    render(<Pagination showSizeChanger={{ onChange: onSizeChange }} total={30} />);

    fireEvent.change(screen.getByTestId('size-changer'), { target: { value: '20' } });
    expect(onSizeChange).toHaveBeenCalledWith('20');

    cleanup();
    const onChange = vi.fn();
    const SizeChanger = ({ onChange: change, value }: any) => (
      <button type="button" onClick={() => change('50')}>
        size {value}
      </button>
    );
    render(
      <Pagination
        showSizeChanger
        components={{ sizeChanger: SizeChanger }}
        total={200}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'size 10' }));
    expect(onChange).toHaveBeenCalledWith(1, 50);
    expect(screen.getByRole('button', { name: 'size 50' })).toBeTruthy();
  });
});
