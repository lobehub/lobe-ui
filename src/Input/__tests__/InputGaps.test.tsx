import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import Input from '../Input';
import InputNumber from '../InputNumber';
import TextArea from '../TextArea';

const clearButton = () => screen.queryByLabelText('Clear');

describe('Input onPressEnter', () => {
  afterEach(cleanup);

  test('fires on Enter and still calls onKeyDown', () => {
    const onPressEnter = vi.fn();
    const onKeyDown = vi.fn();
    render(<Input aria-label="q" onKeyDown={onKeyDown} onPressEnter={onPressEnter} />);

    fireEvent.keyDown(screen.getByLabelText('q'), { key: 'Enter' });

    expect(onPressEnter).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  test('ignores Enter while an IME is composing', () => {
    const onPressEnter = vi.fn();
    render(<Input aria-label="q" onPressEnter={onPressEnter} />);
    const input = screen.getByLabelText('q');

    fireEvent.keyDown(input, { isComposing: true, key: 'Enter' });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });

    expect(onPressEnter).not.toHaveBeenCalled();
  });
});

describe('Input allowClear', () => {
  afterEach(cleanup);

  test('renders no clear button while empty', () => {
    render(<Input allowClear aria-label="q" />);

    expect(clearButton()).toBeNull();
  });

  test('uncontrolled: clears, keeps focus, reports onChange and onClear', () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(
      <Input
        allowClear
        aria-label="q"
        defaultValue="writer"
        onChange={onChange}
        onClear={onClear}
      />,
    );

    fireEvent.click(clearButton()!);
    const input = screen.getByLabelText('q') as HTMLInputElement;

    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
    expect(clearButton()).toBeNull();
  });

  test('controlled: the DOM follows the parent state', () => {
    const Controlled = ({ accept }: { accept: boolean }) => {
      const [value, setValue] = useState('writer');
      return (
        <Input
          allowClear
          aria-label="q"
          value={value}
          onChange={(event) => accept && setValue(event.target.value)}
        />
      );
    };

    const { unmount } = render(<Controlled accept />);
    fireEvent.click(clearButton()!);
    expect((screen.getByLabelText('q') as HTMLInputElement).value).toBe('');
    unmount();

    render(<Controlled accept={false} />);
    fireEvent.click(clearButton()!);
    expect((screen.getByLabelText('q') as HTMLInputElement).value).toBe('writer');
  });

  test('disabled hides the clear button', () => {
    render(<Input allowClear disabled aria-label="q" defaultValue="writer" />);

    expect(clearButton()).toBeNull();
  });
});

describe('InputNumber gaps', () => {
  afterEach(cleanup);

  test('precision fixes fraction digits', () => {
    render(<InputNumber aria-label="n" defaultValue={4096} precision={2} />);

    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('4,096.00');
  });

  test('renders prefix and suffix and fires onPressEnter', () => {
    const onPressEnter = vi.fn();
    render(<InputNumber aria-label="n" prefix="$" suffix="tokens" onPressEnter={onPressEnter} />);

    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('tokens')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onPressEnter).toHaveBeenCalledTimes(1);
  });
});

describe('TextArea gaps', () => {
  afterEach(cleanup);

  test('showCount with maxLength shows used / max and flags overflow', () => {
    render(<TextArea showCount aria-label="t" defaultValue="hello" maxLength={10} />);

    expect(screen.getByText('5 / 10')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('t'), { target: { value: 'hello world!' } });

    const count = screen.getByText('12 / 10');
    expect(count.hasAttribute('data-over')).toBe(true);
  });

  test('counts an emoji as one character', () => {
    render(<TextArea showCount aria-label="t" defaultValue="😀" />);

    expect(screen.getByText('1')).toBeTruthy();
  });

  test('allowClear empties the textarea', () => {
    render(<TextArea allowClear aria-label="t" defaultValue="draft" />);

    fireEvent.click(clearButton()!);

    expect((screen.getByLabelText('t') as HTMLTextAreaElement).value).toBe('');
  });
});
