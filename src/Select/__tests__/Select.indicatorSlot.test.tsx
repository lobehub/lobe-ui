import { render } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';

import Select from '../Select';

const options = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

describe('Select item indicator slot', () => {
  test('reserves the indicator slot on unselected items', () => {
    render(
      <ConfigProvider motion={motion}>
        <Select open options={options} value="small" />
      </ConfigProvider>,
    );

    const indicators = [...document.querySelectorAll('.lobe-select__item-indicator')];
    expect(indicators).toHaveLength(3);

    const visibility = indicators.map((el) => getComputedStyle(el).visibility);
    expect(visibility).toEqual(['visible', 'hidden', 'hidden']);
  });
});
