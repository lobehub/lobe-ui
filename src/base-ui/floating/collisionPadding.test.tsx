import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import Select from '@/base-ui/Select';
import ConfigProvider from '@/ConfigProvider';

import { getFloatingCollisionPadding, setFloatingCollisionPadding } from './collisionPadding';

const positionerSpy = vi.fn();

vi.mock('@base-ui/react/select', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@base-ui/react/select')>();
  const Positioner = (props: any) => {
    positionerSpy(props);
    return <actual.Select.Positioner {...props} />;
  };
  return { ...actual, Select: { ...actual.Select, Positioner } };
});

afterEach(() => {
  setFloatingCollisionPadding(undefined);
  positionerSpy.mockClear();
});

describe('floating collision padding', () => {
  test('keeps base-ui default on sides a partial object leaves out', () => {
    setFloatingCollisionPadding({ top: 40 });

    expect(getFloatingCollisionPadding()).toEqual({ bottom: 5, left: 5, right: 5, top: 40 });
  });

  test('passes a number through untouched and clears on undefined', () => {
    setFloatingCollisionPadding(12);
    expect(getFloatingCollisionPadding()).toBe(12);

    setFloatingCollisionPadding(undefined);
    expect(getFloatingCollisionPadding()).toBeUndefined();
  });

  test('positioners read the global padding at render time', () => {
    setFloatingCollisionPadding({ top: 40 });

    render(
      <ConfigProvider motion={motion}>
        <Select open options={[{ label: 'Lobe AI', value: 'lobe-ai' }]} />
      </ConfigProvider>,
    );

    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(positionerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ collisionPadding: { bottom: 5, left: 5, right: 5, top: 40 } }),
    );
  });
});
