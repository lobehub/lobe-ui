import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import SearchBar from './SearchBar';

const input = () => screen.getByPlaceholderText('Type keywords...') as HTMLInputElement;

describe('SearchBar', () => {
  afterEach(cleanup);

  test('reports typed text through onChange and onInputChange', () => {
    const onChange = vi.fn();
    const onInputChange = vi.fn();
    render(<SearchBar onChange={onChange} onInputChange={onInputChange} />);

    fireEvent.change(input(), { target: { value: 'kit' } });

    expect(input().value).toBe('kit');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange.mock.lastCall?.[0]).toBe('kit');
  });

  test('searches the latest value on Enter', () => {
    const onSearch = vi.fn();
    const onPressEnter = vi.fn();
    render(<SearchBar onPressEnter={onPressEnter} onSearch={onSearch} />);

    fireEvent.change(input(), { target: { value: 'first' } });
    fireEvent.change(input(), { target: { value: 'second' } });
    fireEvent.keyDown(input(), { key: 'Enter' });

    expect(onSearch).toHaveBeenCalledWith('second');
    expect(onPressEnter).toHaveBeenCalledTimes(1);
  });

  test('hides the shortcut tag while focused and restores it on blur when empty', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { container } = render(
      <SearchBar enableShortKey shortKey="k" onBlur={onBlur} onFocus={onFocus} />,
    );
    const tag = () => container.querySelector('kbd');

    expect(tag()).not.toBeNull();
    fireEvent.focus(input());
    expect(tag()).toBeNull();
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.blur(input());
    expect(tag()).not.toBeNull();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('swaps the search icon for a spinner while loading', () => {
    const { container, rerender } = render(<SearchBar />);
    const iconMarkup = () => container.querySelector('[role="img"]')!.innerHTML;
    const idle = iconMarkup();

    rerender(<SearchBar loading />);

    expect(iconMarkup()).not.toBe(idle);
  });

  test('clears the value and reports an empty string', () => {
    const onInputChange = vi.fn();
    render(<SearchBar defaultValue="draft" onInputChange={onInputChange} />);

    fireEvent.click(screen.getByLabelText('Clear'));

    expect(input().value).toBe('');
    expect(onInputChange.mock.lastCall?.[0]).toBe('');
  });
});
