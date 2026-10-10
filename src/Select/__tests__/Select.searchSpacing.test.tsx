import { cleanup, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';

import Select from '../Select';

const options = [{ label: 'Lobe AI', value: 'lobe-ai' }];

describe('Select popup search spacing', () => {
  test('adds top padding only when the popup search field is present', () => {
    render(
      <ConfigProvider motion={motion}>
        <Select open showSearch options={options} placeholder="Search agents" />
      </ConfigProvider>,
    );

    expect(getComputedStyle(screen.getByRole('listbox')).paddingBlockStart).toBe('4px');

    cleanup();

    render(
      <ConfigProvider motion={motion}>
        <Select open options={options} />
      </ConfigProvider>,
    );

    expect(getComputedStyle(screen.getByRole('listbox')).paddingBlockStart).not.toBe('4px');
  });
});
