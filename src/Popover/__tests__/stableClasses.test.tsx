import { render } from '@testing-library/react';

import Popover from '../Popover';

describe('Popover stable classes', () => {
  it('names each class after the part its slot lands on', () => {
    render(
      <Popover
        open
        className="user-popup"
        classNames={{ content: 'user-content', root: 'user-root' }}
        content="Content"
      >
        <button type="button">Trigger</button>
      </Popover>,
    );

    expect(document.querySelector('.lobe-popover')?.classList.contains('user-popup')).toBe(true);
    expect(
      document.querySelector('.lobe-popover__positioner')?.classList.contains('user-root'),
    ).toBe(true);
    expect(
      document.querySelector('.lobe-popover__viewport')?.classList.contains('user-content'),
    ).toBe(true);
    expect(document.querySelector('.lobe-popover__trigger')?.tagName).toBe('BUTTON');
  });
});
