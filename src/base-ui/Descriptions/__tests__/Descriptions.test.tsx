import { cleanup, render, screen } from '@testing-library/react';

import Descriptions from '../Descriptions';

const items = [
  { children: '3,482', key: 'words', label: 'Words' },
  { children: 'jina', key: 'crawler', label: 'Crawler' },
];

describe('Descriptions', () => {
  afterEach(cleanup);

  test('renders label and content pairs in a dl', () => {
    const { container } = render(<Descriptions items={items} />);

    expect(container.querySelectorAll('dl > dt')).toHaveLength(2);
    expect(container.querySelectorAll('dl > dd')).toHaveLength(2);
    expect(screen.getByText('jina')).toBeTruthy();
  });

  test('appends a colon to labels by default', () => {
    const { container } = render(<Descriptions items={items} />);

    expect(container.querySelector('dt')!.textContent).toBe('Words:');
  });

  test('colon={false} drops the colon', () => {
    const { container } = render(<Descriptions colon={false} items={items} />);

    expect(container.querySelector('dt')!.textContent).toBe('Words');
  });

  test('column sets the grid tracks', () => {
    const { container } = render(<Descriptions column={2} items={items} />);

    expect(container.querySelector('dl')!.getAttribute('style')).toContain(
      'repeat(2, auto minmax(0, 1fr))',
    );
  });

  test('span stretches the content cell and is clamped to column', () => {
    const { container } = render(
      <Descriptions column={2} items={[{ children: 'wide', label: 'Wide', span: 5 }]} />,
    );

    expect(container.querySelector('dd')!.getAttribute('style')).toContain('span 3');
  });

  test('renders title and extra in a header', () => {
    render(
      <Descriptions extra={<button type="button">Download</button>} items={items} title="Basic" />,
    );

    expect(screen.getByText('Basic')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
  });

  test('bordered changes the list class', () => {
    const { container, rerender } = render(<Descriptions items={items} />);
    const plain = container.querySelector('dl')!.className;

    rerender(<Descriptions bordered items={items} />);

    expect(container.querySelector('dl')!.className).not.toBe(plain);
  });

  test('styles.label applies to every label', () => {
    const { container } = render(<Descriptions items={items} styles={{ label: { width: 120 } }} />);

    expect(container.querySelector('dt')!.getAttribute('style')).toContain('width: 120px');
  });

  test('sets the displayName', () => {
    expect(Descriptions.displayName).toBe('Descriptions');
  });
});
