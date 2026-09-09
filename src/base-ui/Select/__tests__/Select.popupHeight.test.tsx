import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';

import Select from '../Select';

const options = [{ label: 'Lobe AI', value: 'lobe-ai' }];

describe('Select popup height', () => {
  test('clamps the whole popup, not only the list, to the available height', () => {
    render(
      <ConfigProvider motion={motion}>
        <Select open showSearch listHeight={200} options={options} />
      </ConfigProvider>,
    );

    const popup = screen.getByRole('listbox').parentElement!;

    expect(popup.style.maxHeight).toBe('');
    expect(popup.style.getPropertyValue('--lobe-select-popup-max-height')).toBe('200px');
    expect(getComputedStyle(popup).maxHeight).toBe('var(--lobe-select-available-height)');
  });
});
