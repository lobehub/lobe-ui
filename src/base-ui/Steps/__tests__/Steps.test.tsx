import { cleanup, render, screen } from '@testing-library/react';

import Steps from '../Steps';

const items = [{ title: 'Select type' }, { title: 'Fill form' }, { title: 'Done' }];

const statuses = (container: HTMLElement) =>
  [...container.querySelectorAll('li')].map((li) => li.dataset.status);

describe('Steps', () => {
  afterEach(cleanup);

  test('derives statuses from current', () => {
    const { container } = render(<Steps current={1} items={items} />);

    expect(statuses(container)).toEqual(['finish', 'process', 'wait']);
  });

  test('marks the current step with aria-current', () => {
    render(<Steps current={1} items={items} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems[1].getAttribute('aria-current')).toBe('step');
    expect(listItems[0].getAttribute('aria-current')).toBeNull();
  });

  test('an item status overrides the derived one', () => {
    const { container } = render(
      <Steps current={1} items={[items[0], { ...items[1], status: 'error' }, items[2]]} />,
    );

    expect(statuses(container)).toEqual(['finish', 'error', 'wait']);
  });

  test('without current every item is a neutral guide step', () => {
    const { container } = render(<Steps items={items} />);

    expect(statuses(container)).toEqual(['guide', 'guide', 'guide']);
    expect(container.querySelector('[aria-current]')).toBeNull();
  });

  test('current past the last step marks every step finished', () => {
    const { container } = render(<Steps current={9} items={items} />);

    expect(statuses(container)).toEqual(['finish', 'finish', 'finish']);
  });

  test('shows step numbers, and no number for finished steps', () => {
    render(<Steps current={1} items={items} />);

    expect(screen.queryByText('1')).toBeNull();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  test('a custom icon replaces the number', () => {
    render(<Steps items={[{ icon: <span>ICON</span>, title: 'Create' }]} />);

    expect(screen.getByText('ICON')).toBeTruthy();
    expect(screen.queryByText('1')).toBeNull();
  });

  test('dot variant renders no numbers', () => {
    render(<Steps items={items} orientation="vertical" variant="dot" />);

    expect(screen.queryByText('1')).toBeNull();
  });

  test('renders descriptions', () => {
    render(<Steps items={[{ description: 'Pick one', title: 'Select type' }]} />);

    expect(screen.getByText('Pick one')).toBeTruthy();
  });

  test('sets the displayName', () => {
    expect(Steps.displayName).toBe('Steps');
  });
});
