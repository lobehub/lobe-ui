import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';

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
});
