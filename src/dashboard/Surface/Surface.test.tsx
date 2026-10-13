import { render, screen } from '@testing-library/react';

import { SurfaceLinkProvider } from './link';
import Surface from './Surface';

describe('Surface', () => {
  test('a bare card renders children directly, without a header or body wrapper', () => {
    const { container } = render(<Surface>content</Surface>);
    expect((container.firstElementChild as HTMLElement).textContent).toBe('content');
    expect(container.firstElementChild!.childElementCount).toBe(0);
  });

  test('title is a visible heading, not a DOM tooltip', () => {
    const { container } = render(<Surface title="Usage">body</Surface>);
    expect(screen.getByText('Usage')).toBeTruthy();
    expect(container.firstElementChild!.getAttribute('title')).toBeNull();
  });

  test('href goes through the provided link renderer', () => {
    render(
      <SurfaceLinkProvider
        renderLink={({ children, href }) => (
          <span data-href={href} data-testid="router-link">
            {children}
          </span>
        )}
      >
        <Surface href="/usage" title="Usage" />
      </SurfaceLinkProvider>,
    );
    expect(screen.getByTestId('router-link').dataset.href).toBe('/usage');
  });
});
