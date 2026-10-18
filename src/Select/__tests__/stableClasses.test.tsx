import { cleanup, render } from '@testing-library/react';

import Select from '../Select';

describe('Select stable classes', () => {
  afterEach(cleanup);

  it('mirrors the trigger data attributes on the portal popup', () => {
    render(
      <Select
        open
        classNames={{ dropdown: 'user-dropdown', popup: 'user-popup' }}
        options={[{ label: 'A', value: 'a' }]}
        variant="borderless"
      />,
    );
    const popup = document.querySelector<HTMLElement>('.lobe-select__popup');

    expect(document.querySelector('.lobe-select')?.getAttribute('data-variant')).toBe('borderless');
    expect(popup?.dataset.variant).toBe('borderless');
    expect(popup?.classList.contains('user-dropdown')).toBe(true);
    expect(popup?.classList.contains('user-popup')).toBe(true);
    expect(document.querySelectorAll('.lobe-select__popup')).toHaveLength(1);
  });

  it('puts one option class on each option for the item and option slot aliases', () => {
    render(
      <Select
        open
        classNames={{ item: 'user-item', option: 'user-option' }}
        options={[{ label: 'A', value: 'a' }]}
      />,
    );
    const option = document.querySelector<HTMLElement>('.lobe-select__option');

    expect(option?.classList.contains('user-item')).toBe(true);
    expect(option?.classList.contains('user-option')).toBe(true);
  });
});
