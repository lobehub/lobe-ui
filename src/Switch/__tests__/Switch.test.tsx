import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import Switch from '../Switch';

describe('Switch', () => {
  test('uses native button semantics without Base UI composition errors', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ConfigProvider motion={motion}>
        <form>
          <Switch />
        </form>
      </ConfigProvider>,
    );

    expect(screen.getByRole('switch').getAttribute('type')).toBe('button');
    expect(consoleError.mock.calls.flat().join(' ')).not.toContain('nativeButton');

    consoleError.mockRestore();
  });

  test('toggles without a motion provider', () => {
    const handleChange = vi.fn();

    render(<Switch defaultChecked onChange={handleChange} />);

    const switchEl = screen.getByRole('switch');
    const thumb = switchEl.querySelector('span');

    expect(switchEl.getAttribute('aria-checked')).toBe('true');
    expect(thumb?.style.getPropertyValue('--switch-x')).toBe('14px');

    fireEvent.click(switchEl);

    expect(switchEl.getAttribute('aria-checked')).toBe('false');
    expect(handleChange).toHaveBeenCalledWith(false, expect.anything());
  });

  test('disabled switch ignores press animation', async () => {
    render(<Switch disabled />);

    const switchEl = screen.getByRole('switch');
    const thumb = switchEl.querySelector('span');

    fireEvent.pointerDown(switchEl);
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(thumb?.style.width).toBe('18px');
  });

  test('styles checked, unchecked and disabled states', () => {
    render(
      <>
        <Switch />
        <Switch defaultChecked />
        <Switch disabled />
      </>,
    );

    const [off, on, disabled] = screen.getAllByRole('switch');

    expect(getComputedStyle(off).backgroundColor).toBe(cssVar.colorFillSecondary);
    expect(getComputedStyle(on).backgroundColor).toBe(cssVar.colorPrimary);
    expect(getComputedStyle(off).cursor).toBe('pointer');
    expect(getComputedStyle(disabled).cursor).toBe('not-allowed');
    expect(getComputedStyle(disabled).opacity).toBe('0.45');
    expect(getComputedStyle(disabled.querySelector('span')!).boxShadow).toBe('none');
  });

  test('shows the checked icon only while checked', () => {
    render(<Switch checkedChildren={<i>on</i>} unCheckedChildren={<i>off</i>} />);

    const switchEl = screen.getByRole('switch');
    const iconOn = screen.getByText('on').parentElement!;
    const iconOff = screen.getByText('off').parentElement!;

    expect(getComputedStyle(iconOn).opacity).toBe('0');
    expect(getComputedStyle(iconOff).opacity).toBe('1');

    fireEvent.click(switchEl);

    expect(getComputedStyle(iconOn).opacity).toBe('1');
    expect(getComputedStyle(iconOff).opacity).toBe('0');
  });
});
