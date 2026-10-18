import { render, screen } from '@testing-library/react';
import { Folder } from 'lucide-react';

import Icon from '../Icon';

describe('Icon', () => {
  test('centers the svg instead of sitting it on the text baseline', () => {
    render(<Icon icon={Folder} />);

    const root = getComputedStyle(screen.getByRole('img'));
    expect(root.display).toBe('inline-flex');
    expect(root.alignItems).toBe('center');
    expect(root.lineHeight).toBe('0');
  });

  test('keeps the legacy anticon class next to the stable block', () => {
    render(<Icon className="user-x" icon={Folder} />);

    const root = screen.getByRole('img');
    expect(root.classList.contains('lobe-icon')).toBe(true);
    expect(root.classList.contains('anticon')).toBe(true);
    expect(root.classList.contains('user-x')).toBe(true);
  });
});
