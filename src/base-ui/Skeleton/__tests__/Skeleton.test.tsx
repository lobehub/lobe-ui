import { cleanup, render } from '@testing-library/react';

import Skeleton from '..';

describe('Skeleton', () => {
  afterEach(cleanup);

  test('renders an animated block sized by width/height/radius', () => {
    const { container } = render(<Skeleton height={16} radius={8} width="60%" />);
    const block = container.firstElementChild as HTMLElement;

    expect(block.tagName).toBe('DIV');
    expect(block.style.height).toBe('16px');
    expect(block.style.width).toBe('60%');
    expect(block.style.borderRadius).toBe('8px');
    expect(block.className).not.toBe('');
  });

  test('animated={false} drops the pulse class', () => {
    const { container } = render(<Skeleton animated={false} />);
    const plain = (container.firstElementChild as HTMLElement).className;

    cleanup();
    const { container: c2 } = render(<Skeleton />);
    expect((c2.firstElementChild as HTMLElement).className).not.toBe(plain);
  });

  test('Text renders one row by default and shortens the last of many', () => {
    const { container, rerender } = render(<Skeleton.Text />);
    expect(container.firstElementChild!.children).toHaveLength(1);

    rerender(<Skeleton.Text rows={3} />);
    const rows = [...container.firstElementChild!.children] as HTMLElement[];
    expect(rows.map((r) => r.style.width)).toEqual(['100%', '100%', '66%']);
  });

  test('Text honours per-row widths and falls back to the last one', () => {
    const { container } = render(<Skeleton.Text rows={4} width={['100%', '80%']} />);
    const rows = [...container.firstElementChild!.children] as HTMLElement[];
    expect(rows.map((r) => r.style.width)).toEqual(['100%', '80%', '80%', '80%']);
  });

  test('Avatar is square by default and round when asked', () => {
    const { container, rerender } = render(<Skeleton.Avatar size={32} />);
    const avatar = container.firstElementChild as HTMLElement;
    expect(avatar.style.height).toBe('32px');
    expect(avatar.style.width).toBe('32px');
    expect(avatar.style.borderRadius).toBe('');

    rerender(<Skeleton.Avatar shape="circle" size={32} />);
    expect((container.firstElementChild as HTMLElement).style.borderRadius).toBe('50%');
  });
});
