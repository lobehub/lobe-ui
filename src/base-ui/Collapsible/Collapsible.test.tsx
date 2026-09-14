import { render, screen } from '@testing-library/react';

import Collapsible from './Collapsible';

describe('Collapsible', () => {
  it('unmounts content when closed and mounts it when open', () => {
    const { rerender } = render(<Collapsible open={false}>body</Collapsible>);
    expect(screen.queryByText('body')).toBeNull();
    rerender(<Collapsible open>body</Collapsible>);
    expect(screen.getByText('body')).toBeTruthy();
  });

  it('keepMounted keeps closed content in the DOM', () => {
    render(
      <Collapsible keepMounted open={false}>
        body
      </Collapsible>,
    );
    expect(screen.getByText('body')).toBeTruthy();
  });
});
