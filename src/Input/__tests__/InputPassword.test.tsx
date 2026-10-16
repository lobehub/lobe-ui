import { fireEvent, render, screen } from '@testing-library/react';

import InputPassword from '../InputPassword';

describe('InputPassword', () => {
  test('uses English toggle labels by default', () => {
    render(<InputPassword />);

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));

    expect(screen.getByRole('button', { name: 'Hide password' })).toBeTruthy();
  });

  test('accepts custom toggle labels', () => {
    render(
      <InputPassword visibilityToggleLabels={{ hide: '隐藏确认密码', show: '显示确认密码' }} />,
    );

    const toggle = screen.getByRole('button', { name: '显示确认密码' });
    expect(toggle.getAttribute('title')).toBe('显示确认密码');
    fireEvent.click(toggle);

    expect(screen.getByRole('button', { name: '隐藏确认密码' })).toBeTruthy();
  });
});
