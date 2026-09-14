import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import Pagination from '../Pagination';

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
});
