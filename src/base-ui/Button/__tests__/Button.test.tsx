import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';

import Button from '../Button';

describe('Button', () => {
  test('provides a positioning context for absolutely positioned content', () => {
    render(
      <ConfigProvider motion={motion}>
        <Button>
          Continue
          <span style={{ position: 'absolute' }}>Provider icon</span>
        </Button>
      </ConfigProvider>,
    );

    const button = screen.getByRole('button', { name: /continue/i });

    expect(getComputedStyle(button).position).toBe('relative');
  });
});
