import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AuthLocaleSwitch from './AuthLocaleSwitch';
import AuthThemeSwitch from './AuthThemeSwitch';

describe('AuthThemeSwitch', () => {
  it('uses custom labels and reports the picked mode', () => {
    const onChange = vi.fn();
    render(<AuthThemeSwitch labels={{ dark: '深色' }} value="auto" onChange={onChange} />);
    fireEvent.click(screen.getByTitle('深色'));
    expect(onChange).toHaveBeenCalledWith('dark');
  });
});

describe('AuthLocaleSwitch', () => {
  it('renders the current locale label', () => {
    render(
      <AuthLocaleSwitch
        value="zh-CN"
        options={[
          { label: 'English', value: 'en-US' },
          { label: '简体中文', value: 'zh-CN' },
        ]}
      />,
    );
    expect(screen.getByText('简体中文')).toBeTruthy();
  });
});
