import { render, screen } from '@testing-library/react';
import { Pencil } from 'lucide-react';
import { motion } from 'motion/react';

import { MotionProvider } from '@/MotionProvider';

import { tableActionColumnWidth, TableIconAction } from './TableIconActions';

describe('TableIconActions', () => {
  test('column width fits the icons and the cell padding', () => {
    expect(tableActionColumnWidth(1)).toBe(56);
    expect(tableActionColumnWidth(3)).toBe(3 * 24 + 2 * 4 + 32);
  });

  test('the label is the accessible name', () => {
    render(
      <MotionProvider motion={motion}>
        <TableIconAction icon={Pencil} label="Edit" />
      </MotionProvider>,
    );
    expect(screen.getByLabelText('Edit')).toBeTruthy();
  });
});
