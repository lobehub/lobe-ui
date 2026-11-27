import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Checkbox from '../Checkbox';

describe('Checkbox variant="a2ui"', () => {
  afterEach(cleanup);

  test('is round by default, square on request, and toggles', () => {
    const onChange = vi.fn();
    const { container } = render(
      <>
        <Checkbox variant="a2ui" onChange={onChange}>
          Weekly summary
        </Checkbox>
        <Checkbox defaultChecked shape="square" variant="a2ui">
          Square
        </Checkbox>
      </>,
    );
    const roots = container.querySelectorAll<HTMLElement>('.lobe-checkbox');
    expect(roots[0].dataset.variant).toBe('a2ui');
    expect(roots[0].dataset.shape).toBe('circle');
    expect(roots[1].dataset.shape).toBe('square');
    fireEvent.click(screen.getByText('Weekly summary'));
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });
});
