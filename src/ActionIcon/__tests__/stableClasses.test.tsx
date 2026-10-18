import { cleanup, render, screen } from '@testing-library/react';
import { Settings } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { MotionProvider } from '@/MotionProvider';

import ActionIcon from '../ActionIcon';

const renderIcon = (ui: ReactNode) => render(<MotionProvider motion={motion}>{ui}</MotionProvider>);

describe('ActionIcon stable classes', () => {
  afterEach(cleanup);

  it('shares its root with Button and writes only its own data attributes', () => {
    renderIcon(<ActionIcon shadow icon={Settings} size="small" variant="filled" />);
    const root = screen.getByRole('button');

    expect(root.classList.contains('lobe-action-icon')).toBe(true);
    expect(root.classList.contains('lobe-button')).toBe(true);
    expect(root.dataset.variant).toBe('filled');
    expect(root.dataset.size).toBe('small');
    expect(root.dataset.shadow).toBe('');
    expect(root.dataset.type).toBeUndefined();
  });

  it('keeps preset sizes out of inline style', () => {
    renderIcon(<ActionIcon icon={Settings} size="small" />);
    const root = screen.getByRole('button');

    expect(root.style.width).toBe('');
    expect(root.style.height).toBe('');
    expect(root.style.borderRadius).toBe('');
  });

  it('renders an explicit numeric size inline', () => {
    renderIcon(<ActionIcon icon={Settings} size={20} />);
    const root = screen.getByRole('button');

    expect(root.style.width).toBe('36px');
    expect(root.dataset.size).toBe('20');
  });
});
