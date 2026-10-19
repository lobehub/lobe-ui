import { render } from '@testing-library/react';

import Popover from '../Popover';
import PopoverGroup from '../PopoverGroup';

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

  it('names the trigger inside a PopoverGroup like a standalone one', () => {
    render(
      <PopoverGroup>
        <Popover classNames={{ trigger: 'user-trigger' }} content="Card">
          <button type="button">Element</button>
        </Popover>
        <Popover content="Card">Text</Popover>
      </PopoverGroup>,
    );

    const triggers = document.querySelectorAll('.lobe-popover__trigger');
    expect(triggers).toHaveLength(2);
    expect(triggers[0].tagName).toBe('BUTTON');
    expect(triggers[0].classList.contains('user-trigger')).toBe(true);
  });
});
